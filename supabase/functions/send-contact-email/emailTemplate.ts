import type { ContactEmailRequest } from './types.ts';
import { escapeHtml } from './htmlUtils.ts';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateEmailTemplate = (data: ContactEmailRequest): string => {
  const isGenericContact = data.listing.id === "general-inquiry";
  
  let emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isGenericContact ? 'New General Contact Inquiry' : 'New SBIR Contract Inquiry'}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${isGenericContact ? 'New General Contact Inquiry' : 'New SBIR Contract Inquiry'}</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h2 style="color: #28a745; margin-top: 0;">Contact Information</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>User Account:</strong> ${escapeHtml(data.userEmail)}</p>
          ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ''}
          ${data.referredBy ? `<p><strong>Referred by:</strong> ${escapeHtml(data.referredBy)}</p>` : ''}
          ${data.howDidYouFindUs ? `<p><strong>How did you find us:</strong> ${escapeHtml(data.howDidYouFindUs)}</p>` : ''}
        </div>
  `;

  if (!isGenericContact) {
    emailContent += `
      <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; margin: 20px 0;">
        <h2 style="color: #007bff; margin-top: 0;">Interest Details</h2>
        <p><strong>Interest Level:</strong> ${escapeHtml(data.interestLevel)}</p>
        <p><strong>SBIR Experience:</strong> ${escapeHtml(data.experience)}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6f42c1; margin: 20px 0;">
        <h2 style="color: #6f42c1; margin-top: 0;">Contract Details</h2>
        <p><strong>Title:</strong> ${escapeHtml(data.listing.title)}</p>
        <p><strong>Agency:</strong> ${escapeHtml(data.listing.agency)}</p>
        <p><strong>Phase:</strong> ${escapeHtml(data.listing.phase)}</p>
        <p><strong>Value:</strong> ${formatCurrency(data.listing.value)}</p>
        <p style="font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 4px;"><strong>Contract ID:</strong> ${escapeHtml(data.listing.id)}</p>
      </div>
    `;
  }

  if (data.message) {
    emailContent += `
      <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
        <h2 style="color: #e68900; margin-top: 0;">Additional Message</h2>
        <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
    `;
  }

  emailContent += `
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="text-align: center; color: #6c757d; font-size: 14px;">
          <em>This inquiry was submitted through the SBIR Marketplace platform.<br>
          If you believe this email was sent in error, please contact support.</em>
        </p>
      </div>
    </body>
    </html>
  `;

  return emailContent;
};

export const generateEmailSubject = (data: ContactEmailRequest): string => {
  const isGenericContact = data.listing.id === "general-inquiry";
  
  // Escape HTML in subject line for safety (email clients should handle this, but be safe)
  return isGenericContact 
    ? `New General Contact Inquiry from ${escapeHtml(data.name)}`
    : `New SBIR Contract Inquiry - ${escapeHtml(data.listing.title)}`;
};
