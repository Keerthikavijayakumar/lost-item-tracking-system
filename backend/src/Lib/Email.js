import { Resend } from 'resend';

export async function sendFoundItemEmail({
  ownerEmail,
  itemName,
  foundLocation,
  finderEmail,
  additionalNotes,
  proofImageUrl,
  uniqueIdentifierDescription,
  finderPhoneNumber,
  finderName,
  finderDepartment
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #334155; }
        .wrapper { max-width: 600px; margin: 0 auto; }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo-text { font-size: 26px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px; }
        .logo-sub { color: #f97316; }
        .card { background: #ffffff; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #f1f5f9; }
        .icon-circle { background: #f0fdf4; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #16a34a; }
        .title { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
        .subtitle { font-size: 15px; color: #64748b; margin: 0 0 20px 0; line-height: 1.6; }
        .proof-img { width: 100%; max-width: 280px; border-radius: 8px; margin: 0 auto 20px; display: block; border: 1px solid #f1f5f9; }
        
        .contact-card { background: #f8fafc; border-radius: 8px; padding: 24px; margin-top: 24px; text-align: left; border: 1px solid #e2e8f0; }
        .contact-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        .contact-info { margin-bottom: 12px; }
        .contact-label { font-size: 11px; color: #94a3b8; }
        .contact-value { font-size: 16px; font-weight: 600; color: #1e293b; }
        
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; line-height: 1.8; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="logo">
          <span class="logo-text">kec <span class="logo-sub">campus</span></span>
        </div>
        
        <div class="card">
          <h1 class="title">Good News: ${itemName} Found!</h1>
          <p class="subtitle">A student has reported finding your item. <br> They described it as: <i>"${uniqueIdentifierDescription}"</i></p>
          
          <img src="${proofImageUrl}" class="proof-img" alt="Proof Photo">
          
          <div class="contact-card">
            <div class="contact-title">Finder's Contact Information</div>
            
            <div class="contact-info">
              <div class="contact-label">NAME</div>
              <div class="contact-value">${finderName}</div>
            </div>
            
            <div class="contact-info">
              <div class="contact-label">DEPARTMENT</div>
              <div class="contact-value">${finderDepartment}</div>
            </div>
            
            <div class="contact-info">
              <div class="contact-label">PHONE NUMBER</div>
              <div class="contact-value">${finderPhoneNumber}</div>
            </div>
            
            <div class="contact-info">
              <div class="contact-label">EMAIL</div>
              <div class="contact-value">${finderEmail}</div>
            </div>
          </div>
 
          <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
            Please contact the finder directly to arrange pickup.
          </p>
        </div>
        
        <div class="footer">
          Kongu Engineering College • Campus Lost & Found System <br>
          This is an automated notification. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const emailData = {
      from: 'Campus Lost & Found <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Good News: Your lost ${itemName} has been found!`,
      html: htmlContent,
    };

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend API Error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('sendFoundItemEmail function error:', error);
    throw error;
  }
}
