
import type { ChangeRequestStatusNotificationRequest } from './types.ts';

export const generateEmailSubject = (data: ChangeRequestStatusNotificationRequest): string => {
  const requestType = data.changeRequest.request_type;
  const status = data.changeRequest.status;
  const listingTitle = data.changeRequest.listing_title || 'Your Listing';
  
  return `Your ${requestType === 'change' ? 'Change' : 'Deletion'} Request has been ${status === 'approved' ? 'Approved' : 'Rejected'} - ${listingTitle}`;
};

export const generateEmailTemplate = (data: ChangeRequestStatusNotificationRequest): string => {
  const requestType = data.changeRequest.request_type;
  const status = data.changeRequest.status;
  const isApproved = status === 'approved';
  const listingTitle = data.changeRequest.listing_title || 'Your Listing';
  const listingAgency = data.changeRequest.listing_agency || 'Unknown Agency';

  const statusColor = isApproved ? '#28a745' : '#dc3545';
  const statusBgColor = isApproved ? '#d4edda' : '#f8d7da';

  let adminNotesSection = '';
  if (data.changeRequest.admin_notes_for_user) {
    adminNotesSection = `
      <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
        <h2 style="color: #17a2b8; margin-top: 0;">Message from Admin</h2>
        <p style="white-space: pre-wrap;">${data.changeRequest.admin_notes_for_user}</p>
      </div>
    `;
  }

  const nextStepsSection = isApproved 
    ? (requestType === 'change' 
       ? `<p>Your requested changes have been applied to your listing. You can view the updated listing on the SBIR Marketplace.</p>`
       : `<p>Your listing has been removed from the SBIR Marketplace as requested.</p>`)
    : `<p>Your ${requestType} request was not approved. If you have questions about this decision, please contact our support team.</p>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Request ${status === 'approved' ? 'Approved' : 'Rejected'}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Request ${isApproved ? 'Approved' : 'Rejected'}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your ${requestType} request has been ${status}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 25px;">Hello ${data.userName},</p>
        
        <div style="background: ${statusBgColor}; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin: 20px 0;">
          <h2 style="color: ${statusColor}; margin-top: 0;">Request Status Update</h2>
          <p><strong>Status:</strong> ${isApproved ? 'Approved' : 'Rejected'}</p>
          <p><strong>Request Type:</strong> ${requestType === 'change' ? 'Change Request' : 'Deletion Request'}</p>
          <p><strong>Listing:</strong> ${listingTitle}</p>
          <p><strong>Agency:</strong> ${listingAgency}</p>
        </div>
        
        ${adminNotesSection}
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6c757d; margin: 20px 0;">
          <h2 style="color: #6c757d; margin-top: 0;">Next Steps</h2>
          ${nextStepsSection}
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
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
