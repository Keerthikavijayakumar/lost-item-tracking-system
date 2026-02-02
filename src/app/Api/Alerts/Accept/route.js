import { NextResponse } from 'next/server';
import connectDB from '@/Backend/Lib/MongoDB';
import Alert from '@/Backend/Models/Alert';
import LostItem from '@/Backend/Models/LostItem';
import { deleteImage } from '@/Backend/Lib/Cloudinary';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return new NextResponse('<h1>Invalid Token</h1><p>Missing security token.</p>', {
                status: 400,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        await connectDB();

        // 1. Find the alert by token (regardless of status for idempotency)
        const alert = await Alert.findOne({
            actionToken: token
        });

        if (!alert) {
            return new NextResponse('<h1>Recovery Not Found</h1><p>The link is invalid or has expired.</p>', {
                status: 404,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // 2. If already ACCEPTED, just show success (handles double clicks/pre-fetching)
        if (alert.status === 'ACCEPTED') {
            return renderSuccessPage(alert);
        }

        // 3. If already REJECTED, show notice
        if (alert.status === 'REJECTED') {
            return new NextResponse('<h1>Already Rejected</h1><p>You have previously rejected this match.</p><a href="/Dashboard">Go to Dashboard</a>', {
                status: 200,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // 2. Check expiration (24h)
        if (alert.expiresAt && alert.expiresAt < new Date()) {
            return new NextResponse('<h1>Link Expired</h1><p>This recovery link has expired for security reasons.</p>', {
                status: 410,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // 5. Mark alert as ACCEPTED (Keep the token for subsequent success page renders)
        alert.status = 'ACCEPTED';
        // We do NOT unset actionToken anymore to support pre-fetching/re-clicks
        await alert.save();

        // 4. Delete the original Lost Item and its image
        const lostItem = await LostItem.findById(alert.lostItemId);
        if (lostItem) {
            if (lostItem.imagePublicId) {
                try {
                    await deleteImage(lostItem.imagePublicId);
                } catch (imageError) {
                    console.error('Failed to cleanup image on acceptance:', imageError);
                }
            }
            await LostItem.findByIdAndDelete(alert.lostItemId);
        }

        // 7. Return Success Page
        return renderSuccessPage(alert);
    } catch (error) {
        console.error('Acceptance error:', error);
        return new NextResponse('<h1>Server Error</h1><p>Failed to process the request.</p>', {
            status: 500,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

function renderSuccessPage(alert) {
    return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #334155; height: 100vh; display: flex; align-items: center; justify-content: center; }
                .card { background: white; padding: 48px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); text-align: center; max-width: 440px; border-top: 5px solid #16a34a; }
                .icon { background: #f0fdf4; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #16a34a; }
                h1 { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 16px; }
                p { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
                .contact-box { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 32px; }
                .contact-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
                .contact-value { font-size: 20px; font-weight: 700; color: #1e3a8a; }
                .btn { display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 25px; font-weight: 600; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h1>Recovery Accepted</h1>
                <p>The post for <strong>${alert.itemName}</strong> has been removed. You can now contact the finder to arrange the recovery.</p>
                <div class="contact-box">
                    <div class="contact-label">Finder's Phone Number</div>
                    <div class="contact-value">${alert.finderPhoneNumber}</div>
                </div>
                <a href="/Dashboard" class="btn">Go to Dashboard</a>
            </div>
        </body>
        </html>
    `, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
    });
}
