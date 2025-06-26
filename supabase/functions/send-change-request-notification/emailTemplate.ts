
import type { ChangeRequestNotificationRequest } from './types.ts';

export const generateEmailSubject = (data: ChangeRequestNotificationRequest): string => {
  const requestType = data.changeRequest.request_type;
  const listingTitle = data.changeRequest.sbir_listings?.title || 'Unknown Listing';
  return `New Listing ${requestType === 'change' ? 'Change' : 'Deletion'} Request - ${listingTitle}`;
};

export const generateEmailTemplate = (data: ChangeRequestNotificationRequest): string => {
  const requestType = data.changeRequest.request_type;
  const listingTitle = data.changeRequest.sbir_listings?.title || 'Unknown Listing';
  const listingAgency = data.changeRequest.sbir_listings?.agency || 'Unknown Agency';

  let changesSection = '';
  if (requestType === 'change' && data.changeRequest.requested_changes) {
    const changes = Object.entries(data.changeRequest.requested_changes)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => {
        const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return `<li><strong>${fieldName}:</strong> ${value}</li>`;
      }).join('');
    
    if (changes) {
      changesSection = `
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <h2 style="color: #2563eb; margin-top: 0;">Requested Changes</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${changes}
          </ul>
        </div>
      `;
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Listing ${requestType === 'change' ? 'Change' : 'Deletion'} Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New Listing ${requestType === 'change' ? 'Change' : 'Deletion'} Request</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 25px;">A ${requestType === 'change' ? 'change' : 'deletion'} request has been submitted for a listing and requires your review.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h2 style="color: #667eea; margin-top: 0;">Listing Details</h2>
          <p><strong>Title:</strong> ${listingTitle}</p>
          <p><strong>Agency:</strong> ${listingAgency}</p>
          <p><strong>Request Type:</strong> ${requestType === 'change' ? 'Change Request' : 'Deletion Request'}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h2 style="color: #e68900; margin-top: 0;">Submitted By</h2>
          <p><strong>Name:</strong> ${data.submitterName}</p>
          <p><strong>Email:</strong> ${data.submitterEmail}</p>
        </div>
        
        ${changesSection}
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h2 style="color: #28a745; margin-top: 0;">Reason</h2>
          <p style="white-space: pre-wrap;">${data.changeRequest.reason || 'No reason provided'}</p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="color: #1976d2; margin-top: 0;">Action Required</h2>
          <p style="margin-bottom: 15px;">Please log into the admin panel to review and approve or reject this ${requestType} request.</p>
          <p style="font-family: monospace; background: white; padding: 10px; border-radius: 4px; display: inline-block;"><strong>Request ID:</strong> ${data.changeRequest.id}</p>
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
