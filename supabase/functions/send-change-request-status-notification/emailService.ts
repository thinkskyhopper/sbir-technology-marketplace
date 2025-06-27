
import { Resend } from "npm:resend@2.0.0";
import type { ChangeRequestStatusNotificationRequest, EmailResult } from './types.ts';
import { generateEmailTemplate, generateEmailSubject } from './emailTemplate.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export const sendChangeRequestStatusEmail = async (
  data: ChangeRequestStatusNotificationRequest
): Promise<EmailResult> => {
  const subject = generateEmailSubject(data);
  const emailContent = generateEmailTemplate(data);
  
  console.log(`📤 Sending change request status email to: ${data.userEmail}`);
  
  try {
    const emailResponse = await resend.emails.send({
      from: "SBIR Marketplace <noreply@updates.thesbirtechmarketplace.com>",
      to: [data.userEmail],
      subject: subject,
      html: emailContent,
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@thesbirtechmarketplace.com>',
        'X-Entity-ID': `change-request-status-${data.changeRequest.id}`,
      }
    });

    console.log(`✅ Change request status email sent successfully:`, emailResponse);
    return { success: true, email: data.userEmail, response: emailResponse };
  } catch (error) {
    console.error(`❌ Failed to send change request status email:`, error);
    return { success: false, email: data.userEmail, error: error.message };
  }
};
