
import type { CSVUploadDetails } from './types.ts';

export const generateEmailSubject = (uploadDetails: CSVUploadDetails): string => {
  return `Bulk CSV Upload Completed - ${uploadDetails.listingCount} SBIR Listings Imported`;
};

export const generateEmailTemplate = (uploadDetails: CSVUploadDetails): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bulk CSV Upload Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Bulk CSV Upload Completed</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 25px;">A bulk CSV upload has been successfully completed on the SBIR Marketplace platform.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h2 style="color: #28a745; margin-top: 0;">Upload Summary</h2>
          <p><strong>File Name:</strong> ${uploadDetails.fileName}</p>
          <p><strong>Total Listings:</strong> ${uploadDetails.listingCount}</p>
          <p><strong>Status:</strong> All listings created with "Pending" status</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h2 style="color: #667eea; margin-top: 0;">Uploaded By</h2>
          <p><strong>Name:</strong> ${uploadDetails.uploadedBy}</p>
          <p><strong>Email:</strong> ${uploadDetails.uploaderEmail}</p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="color: #1976d2; margin-top: 0;">Action Required</h2>
          <p style="margin-bottom: 15px;">Please review and approve the newly imported listings in the admin panel. All imported listings have been set to "Pending" status.</p>
          <p style="font-size: 14px; color: #6c757d;">You can review and approve these listings in the SBIR Listings section of the admin dashboard.</p>
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
