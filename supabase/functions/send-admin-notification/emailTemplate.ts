
import type { AdminNotificationRequest } from './types.ts';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateEmailSubject = (data: AdminNotificationRequest): string => {
  return `New SBIR Listing Pending Approval - ${data.listing.title}`;
};

export const generateEmailTemplate = (data: AdminNotificationRequest): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New SBIR Listing Requires Approval</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New SBIR Listing Requires Approval</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 25px;">A new SBIR contract listing has been submitted and is pending your approval.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h2 style="color: #667eea; margin-top: 0;">Listing Details</h2>
          <p><strong>Title:</strong> ${data.listing.title}</p>
          <p><strong>Agency:</strong> ${data.listing.agency}</p>
          <p><strong>Phase:</strong> ${data.listing.phase}</p>
          <p><strong>Category:</strong> ${data.listing.category}</p>
          <p><strong>Value:</strong> ${formatCurrency(data.listing.value)}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h2 style="color: #28a745; margin-top: 0;">Description</h2>
          <p style="white-space: pre-wrap;">${data.listing.description}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h2 style="color: #e68900; margin-top: 0;">Submitted By</h2>
          <p><strong>Name:</strong> ${data.submitterName}</p>
          <p><strong>Email:</strong> ${data.submitterEmail}</p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="color: #1976d2; margin-top: 0;">Action Required</h2>
          <p style="margin-bottom: 15px;">Please log into the admin panel to review and approve or reject this listing.</p>
          <p style="font-family: monospace; background: white; padding: 10px; border-radius: 4px; display: inline-block;"><strong>Listing ID:</strong> ${data.listing.id}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="text-align: center; color: #6c757d; font-size: 14px;">
          <em>This notification was sent automatically from the SBIR Marketplace platform.<br>
          If you believe this email was sent in error, please contact support.</em>
        </p>
      </div>
    </body>
    </html>
  `;
};
