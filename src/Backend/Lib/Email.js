import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #334155; }
        .wrapper { max-width: 600px; margin: 0 auto; }
        .logo { text-align: center; margin-bottom: 32px; }
        .logo-text { font-size: 26px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px; }
        .logo-sub { color: #f97316; }
        .card { background: #ffffff; border-radius: 8px; padding: 48px 32px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .icon-circle { background: #f0fdf4; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #16a34a; }
        .title { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0; }
        .subtitle { font-size: 15px; color: #64748b; margin: 0 0 32px 0; line-height: 1.6; }
        .proof-img { width: 100%; max-width: 280px; border-radius: 8px; margin: 0 auto 24px; display: block; border: 1px solid #f1f5f9; }
        
        .contact-card { background: #f1f5f9; border-radius: 8px; padding: 24px; margin-top: 32px; text-align: left; }
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
          <div class="icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          
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
    const { data, error } = await resend.emails.send({
      from: 'Campus Lost & Found <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Good News: Your lost ${itemName} has been found!`,
      html: htmlContent,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

