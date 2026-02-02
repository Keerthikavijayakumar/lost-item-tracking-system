import express from 'express';
import Alert from '../Models/Alert.js';
import LostItem from '../Models/LostItem.js';
import connectDB from '../Lib/MongoDB.js';
import { deleteImage } from '../Lib/Cloudinary.js';
import { sendFoundItemEmail } from '../Lib/Email.js';

const router = express.Router();

// Helper to render HTML response
const renderHtml = (res, status, html) => {
    res.status(status).set('Content-Type', 'text/html').send(html);
};

// GET Accept Alert
router.get('/accept', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return renderHtml(res, 400, '<h1>Invalid Token</h1>');

        await connectDB();
        const alert = await Alert.findOne({ actionToken: token });

        if (!alert) return renderHtml(res, 404, '<h1>Recovery Not Found</h1>');
        if (alert.status === 'ACCEPTED') return renderHtml(res, 200, renderSuccessPage(alert));
        if (alert.status === 'REJECTED') return renderHtml(res, 200, '<h1>Already Rejected</h1>');

        alert.status = 'ACCEPTED';
        await alert.save();

        const lostItem = await LostItem.findById(alert.lostItemId);
        if (lostItem) {
            if (lostItem.imagePublicId) {
                try { await deleteImage(lostItem.imagePublicId); } catch (e) { console.error(e); }
            }
            await LostItem.findByIdAndDelete(alert.lostItemId);
        }

        renderHtml(res, 200, renderSuccessPage(alert));
    } catch (error) {
        console.error(error);
        renderHtml(res, 500, '<h1>Server Error</h1>');
    }
});

// GET Reject Alert
router.get('/reject', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return renderHtml(res, 400, '<h1>Invalid Token</h1>');

        await connectDB();
        const alert = await Alert.findOne({ actionToken: token });

        if (!alert) return renderHtml(res, 404, '<h1>Recovery Not Found</h1>');
        if (alert.status === 'REJECTED') return renderHtml(res, 200, '<h1>Already Rejected</h1>');

        alert.status = 'REJECTED';
        await alert.save();

        renderHtml(res, 200, '<h1>Match Rejected</h1><p>The post remains active in the feed.</p>');
    } catch (error) {
        console.error(error);
        renderHtml(res, 500, '<h1>Server Error</h1>');
    }
});

function renderSuccessPage(alert) {
    return `
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
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="btn">Go to Dashboard</a>
            </div>
        </body>
        </html>
    `;
}

export default router;
