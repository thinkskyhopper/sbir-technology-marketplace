
import { Resend } from "npm:resend@2.0.0";
import type { ContactEmailRequest, EmailResult } from './types.ts';
import { generateEmailTemplate, generateEmailSubject } from './emailTemplate.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Helper function to add delay between email sends
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendContactEmails = async (
  data: ContactEmailRequest, 
  adminEmails: string[]
): Promise<EmailResult[]> => {
  const subject = generateEmailSubject(data);
  const emailContent = generateEmailTemplate(data);
  const results: EmailResult[] = [];
  
  console.log(`📤 Starting to send contact emails to ${adminEmails.length} admin(s)`);
  
  for (let i = 0; i < adminEmails.length; i++) {
    const adminEmail = adminEmails[i];
    console.log(`📤 Sending contact email ${i + 1}/${adminEmails.length} to:`, adminEmail);
    
    try {
      const emailResponse = await resend.emails.send({
        from: "SBIR Marketplace <noreply@updates.thesbirtechmarketplace.com>",
        to: [adminEmail],
        subject: subject,
        html: emailContent,
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@thesbirtechmarketplace.com>',
          'X-Entity-ID': `contact-inquiry-${Date.now()}`,
          'X-Priority': '3',
          'Reply-To': data.email
        }
      });
      
      console.log(`✅ Contact email sent successfully to ${adminEmail}:`, emailResponse);
      results.push({ success: true, email: adminEmail, response: emailResponse });
    } catch (error) {
      console.error(`❌ Failed to send contact email to ${adminEmail}:`, error);
      results.push({ success: false, email: adminEmail, error: error.message });
      
      // If it's a rate limit error, wait longer before the next attempt
      if (error.message && error.message.includes('rate_limit_exceeded')) {
        console.log('Rate limit detected, waiting 2 seconds before next email...');
        await delay(2000);
      }
    }
    
    // Add a delay between each email to prevent rate limiting
    // Skip delay for the last email
    if (i < adminEmails.length - 1) {
      await delay(800);
    }
  }
  
  console.log(`📊 Contact email batch complete: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`);
  return results;
};
