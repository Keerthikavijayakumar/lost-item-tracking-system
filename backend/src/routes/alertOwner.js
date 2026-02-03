import express from 'express';
import Alert from '../Models/Alert.js';
import LostItem from '../Models/LostItem.js';
import connectDB from '../Lib/MongoDB.js';
import { sendFoundItemEmail } from '../Lib/Email.js';

import { requireAuth } from '../Lib/Auth.js';

const router = express.Router();

// Finder reports item as found (notifies owner)
router.post('/', requireAuth, async (req, res) => {
    try {
        await connectDB();
        console.log('Received alert request:', req.body);
        const { userId, finderName, finderEmail, ...body } = req.body;
        const {
            lostItemId,
            foundLocation,
            dateFound,
            additionalNotes,
            proofImageUrl,
            uniqueIdentifierDescription,
            finderPhoneNumber,
            finderDepartment
        } = body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        if (!proofImageUrl || !uniqueIdentifierDescription || !finderPhoneNumber || !finderDepartment) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const lostItem = await LostItem.findById(lostItemId);
        if (!lostItem) return res.status(404).json({ error: 'Lost item not found' });

        if (lostItem.ownerUserId === userId) {
            return res.status(400).json({ error: 'You cannot report your own item as found.' });
        }

        const newAlert = await Alert.create({
            itemName: lostItem.itemName,
            itemDescription: lostItem.description,
            ownerEmail: lostItem.ownerEmail,
            ownerUserId: lostItem.ownerUserId,
            finderEmail: finderEmail,
            finderUserId: userId,
            foundLocation,
            dateFound,
            additionalNotes,
            proofImageUrl,
            uniqueIdentifierDescription,
            finderPhoneNumber,
            finderDepartment,
            finderName,
            status: 'ACCEPTED',
            lostItemId: lostItem._id,
            emailSent: false
        });

        // Send Email
        if (process.env.RESEND_API_KEY) {
            try {
                console.log(`Attempting to send email to ${lostItem.ownerEmail} for item ${lostItem.itemName}`);
                const emailResult = await sendFoundItemEmail({
                    ownerEmail: lostItem.ownerEmail,
                    itemName: lostItem.itemName,
                    itemDescription: lostItem.description,
                    foundLocation,
                    dateFound,
                    finderEmail,
                    additionalNotes,
                    proofImageUrl,
                    uniqueIdentifierDescription,
                    finderPhoneNumber,
                    finderName,
                    finderDepartment,
                });
                console.log('Email sent successfully:', emailResult);
                await Alert.findByIdAndUpdate(newAlert._id, { emailSent: true });
            } catch (emailError) {
                console.error('Email send failed details:', emailError);
            }
        } else {
            console.warn('RESEND_API_KEY is missing, skipping email.');
        }

        res.status(200).json({ message: 'Alert sent successfully. The owner has been notified.', success: true });
    } catch (error) {
        console.error('Error processing alert:', error);
        res.status(500).json({ error: 'Failed to process alert' });
    }
});

export default router;
