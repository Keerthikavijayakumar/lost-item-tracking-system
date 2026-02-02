import { NextResponse } from 'next/server';
import connectDB from '@/Backend/Lib/MongoDB';
import Alert from '@/Backend/Models/Alert';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return new NextResponse('<h1>Invalid Token</h1>', { status: 400, headers: { 'Content-Type': 'text/html' } });
        }

        await connectDB();

        // 1. Find the alert by token only
        const alert = await Alert.findOne({
            actionToken: token
        });

        if (!alert) {
            return new NextResponse('<h1>Recovery Not Found</h1><p>The link is invalid or has expired.</p>', {
                status: 404,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // 2. If already REJECTED, just show page
        if (alert.status === 'REJECTED') {
            return renderRejectionPage(alert);
        }

        // 3. If already ACCEPTED, show notice
        if (alert.status === 'ACCEPTED') {
            return new NextResponse('<h1>Already Accepted</h1><p>This match was already accepted and the post removed.</p><a href="/Dashboard">Go to Dashboard</a>', {
                status: 200,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // 4. Mark alert as REJECTED (Keep token)
        alert.status = 'REJECTED';
        await alert.save();

        return renderRejectionPage(alert);

    } catch (error) {
        console.error('Rejection error:', error);
        return new NextResponse('<h1>Server Error</h1>', { status: 500, headers: { 'Content-Type': 'text/html' } });
    }
}

function renderRejectionPage(alert) {
    return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #334155; height: 100vh; display: flex; align-items: center; justify-content: center; }
                .card { background: white; padding: 48px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); text-align: center; max-width: 440px; border-top: 5px solid #ef4444; }
                .icon { background: #fef2f2; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #ef4444; }
                h1 { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 16px; }
                p { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 32px; }
                .btn { display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 25px; font-weight: 600; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <h1>Match Rejected</h1>
                <p>You have rejected the match for <strong>${alert.itemName}</strong>. Your lost item post will remain visible in the public feed.</p>
                <a href="/Dashboard" class="btn">Go to Dashboard</a>
            </div>
        </body>
        </html>
    `, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
    });
}
