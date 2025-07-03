
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseProfile {
  id: string
  email: string
  full_name: string | null
  notification_categories: string[] | null
  email_notifications_enabled: boolean
  category_email_notifications_enabled: boolean
}

interface DatabaseListing {
  id: string
  title: string
  agency: string
  category: string
  phase: string
  value: number
  deadline: string
  description: string
  created_at: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily notifications job...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const resend = new Resend(resendApiKey)
    
    const today = new Date().toISOString().split('T')[0]
    const yesterdayStart = new Date()
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    yesterdayStart.setHours(0, 0, 0, 0)
    
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    console.log(`Checking for listings created between ${yesterdayStart.toISOString()} and ${todayStart.toISOString()}`)
    
    // Check if we've already run today
    const { data: existingRun } = await supabase
      .from('notification_job_runs')
      .select('id')
      .eq('run_date', today)
      .single()
    
    if (existingRun) {
      console.log('Job already run today, skipping...')
      return new Response(
        JSON.stringify({ message: 'Job already run today' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create job run record
    const { data: jobRun, error: jobError } = await supabase
      .from('notification_job_runs')
      .insert({
        run_date: today,
        started_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (jobError) {
      console.error('Failed to create job run record:', jobError)
      throw jobError
    }
    
    // Get new listings from the past 24 hours
    const { data: newListings, error: listingsError } = await supabase
      .from('sbir_listings')
      .select('id, title, agency, category, phase, value, deadline, description, created_at')
      .gte('created_at', yesterdayStart.toISOString())
      .lt('created_at', todayStart.toISOString())
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
    
    if (listingsError) {
      console.error('Failed to fetch new listings:', listingsError)
      throw listingsError
    }
    
    console.log(`Found ${newListings?.length || 0} new listings`)
    
    if (!newListings || newListings.length === 0) {
      // Update job run as completed with no emails sent
      await supabase
        .from('notification_job_runs')
        .update({
          completed_at: new Date().toISOString(),
          total_users_processed: 0,
          total_emails_sent: 0
        })
        .eq('id', jobRun.id)
      
      return new Response(
        JSON.stringify({ message: 'No new listings to notify about' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get all users who have notification categories set AND have email notifications enabled
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, notification_categories, email_notifications_enabled, category_email_notifications_enabled')
      .not('notification_categories', 'is', null)
      .neq('notification_categories', '[]')
      .eq('email_notifications_enabled', true)
      .eq('category_email_notifications_enabled', true)
    
    if (usersError) {
      console.error('Failed to fetch users:', usersError)
      throw usersError
    }
    
    console.log(`Found ${users?.length || 0} users with notification preferences and email notifications enabled`)
    
    let emailsSent = 0
    const errors: any[] = []
    
    if (users && users.length > 0) {
      for (const user of users as DatabaseProfile[]) {
        try {
          const userCategories = user.notification_categories || []
          
          // Filter listings that match user's categories
          const relevantListings = (newListings as DatabaseListing[]).filter(listing => 
            userCategories.includes(listing.category)
          )
          
          if (relevantListings.length === 0) {
            console.log(`No relevant listings for user ${user.email}`)
            continue
          }
          
          // Check if user has already been notified about these listings
          const { data: existingBatches } = await supabase
            .from('notification_batches')
            .select('listing_id')
            .eq('user_id', user.id)
            .in('listing_id', relevantListings.map(l => l.id))
          
          const alreadyNotifiedIds = new Set(existingBatches?.map(b => b.listing_id) || [])
          const newRelevantListings = relevantListings.filter(l => !alreadyNotifiedIds.has(l.id))
          
          if (newRelevantListings.length === 0) {
            console.log(`User ${user.email} already notified about all relevant listings`)
            continue
          }
          
          // Create email content
          const emailHtml = createEmailHtml(user, newRelevantListings as DatabaseListing[])
          
          // Send email
          const { error: emailError } = await resend.emails.send({
            from: 'SBIR Listings <notifications@yourdomain.com>',
            to: [user.email],
            subject: `New SBIR Listings - ${newRelevantListings.length} listing${newRelevantListings.length > 1 ? 's' : ''} in your categories`,
            html: emailHtml,
          })
          
          if (emailError) {
            console.error(`Failed to send email to ${user.email}:`, emailError)
            errors.push({ user_email: user.email, error: emailError })
            continue
          }
          
          // Record notification batches
          const batchInserts = newRelevantListings.map(listing => ({
            user_id: user.id,
            listing_id: listing.id,
            sent_at: new Date().toISOString()
          }))
          
          const { error: batchError } = await supabase
            .from('notification_batches')
            .insert(batchInserts)
          
          if (batchError) {
            console.error(`Failed to record notification batches for ${user.email}:`, batchError)
            errors.push({ user_email: user.email, error: batchError })
          } else {
            emailsSent++
            console.log(`Successfully sent notification to ${user.email} for ${newRelevantListings.length} listings`)
          }
          
        } catch (error) {
          console.error(`Error processing user ${user.email}:`, error)
          errors.push({ user_email: user.email, error: error.message })
        }
      }
    }
    
    // Update job run record
    await supabase
      .from('notification_job_runs')
      .update({
        completed_at: new Date().toISOString(),
        total_users_processed: users?.length || 0,
        total_emails_sent: emailsSent,
        errors: errors
      })
      .eq('id', jobRun.id)
    
    console.log(`Job completed. Processed ${users?.length || 0} users, sent ${emailsSent} emails`)
    
    return new Response(
      JSON.stringify({
        message: 'Daily notifications job completed',
        users_processed: users?.length || 0,
        emails_sent: emailsSent,
        errors_count: errors.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Job failed:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function createEmailHtml(user: DatabaseProfile, listings: DatabaseListing[]): string {
  const userName = user.full_name || user.email.split('@')[0]
  
  const formatCurrency = (amountInCents: number) => {
    // Convert cents to dollars before formatting
    const amountInDollars = amountInCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountInDollars);
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const listingsHtml = listings.map(listing => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; background-color: #ffffff;">
      <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">${listing.title}</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px; font-size: 14px; color: #6b7280;">
        <span><strong>Agency:</strong> ${listing.agency}</span>
        <span><strong>Phase:</strong> ${listing.phase}</span>
        <span><strong>Category:</strong> ${listing.category}</span>
        <span><strong>Value:</strong> ${formatCurrency(listing.value)}</span>
        <span><strong>Deadline:</strong> ${formatDate(listing.deadline)}</span>
      </div>
      <p style="color: #4b5563; line-height: 1.5; margin: 10px 0;">${listing.description.substring(0, 200)}${listing.description.length > 200 ? '...' : ''}</p>
      <a href="https://yourdomain.com/listing/${listing.id}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px; margin-top: 10px;">View Details</a>
    </div>
  `).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New SBIR Listings</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px;">
        <h1 style="color: #1f2937; margin-bottom: 20px;">New SBIR Listings</h1>
        <p style="font-size: 16px; margin-bottom: 25px;">Hello ${userName},</p>
        <p style="font-size: 16px; margin-bottom: 25px;">
          We found ${listings.length} new SBIR listing${listings.length > 1 ? 's' : ''} that match your notification preferences from the past 24 hours:
        </p>
        
        ${listingsHtml}
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280;">
          <p>You're receiving this email because you've subscribed to notifications for specific SBIR categories.</p>
          <p>To update your notification preferences, <a href="https://yourdomain.com/settings" style="color: #3b82f6;">visit your settings</a>.</p>
          <p style="margin-top: 20px;">Best regards,<br>The SBIR Listings Team</p>
        </div>
      </div>
    </body>
    </html>
  `
}
