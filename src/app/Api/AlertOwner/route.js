import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/Backend/Lib/MongoDB';
import LostItem from '@/Backend/Models/LostItem';
import Alert from '@/Backend/Models/Alert';
import { deleteImage } from '@/Backend/Lib/Cloudinary';
import { sendFoundItemEmail } from '@/Backend/Lib/Email';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();
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

        if (!proofImageUrl || !uniqueIdentifierDescription || !finderPhoneNumber || !finderDepartment) {
            return NextResponse.json({ error: 'All fields including department are required' }, { status: 400 });
        }

        // 1. Fetch the original lost item
        const lostItem = await LostItem.findById(lostItemId);
        if (!lostItem) {
            return NextResponse.json({ error: 'Lost item not found' }, { status: 404 });
        }

        // Prevent self-alerts (Owner cannot report their own item as found)
        if (lostItem.ownerUserId === userId) {
            return NextResponse.json({ error: 'You cannot report your own item as found.' }, { status: 400 });
        }

        // 2. Create the Alert record
        const finderEmail = user.emailAddresses[0]?.emailAddress;
        const finderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'A Student';

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
            status: 'ACCEPTED', // Mark as accepted immediately in this direct flow
            lostItemId: lostItem._id,
            emailSent: false
        });

        // 3. Send Email via centralized utility
        let emailSentStatus = false;
        if (process.env.RESEND_API_KEY) {
            try {
                await sendFoundItemEmail({
                    ownerEmail: lostItem.ownerEmail,
                    itemName: lostItem.itemName,
                    itemDescription: lostItem.description,
                    foundLocation,
                    dateFound,
                    finderEmail,
                    additionalNotes,
                    proofImageUrl,
                    proofImageUrl,
                    uniqueIdentifierDescription,
                    finderPhoneNumber,
                    finderName,
                    finderDepartment,
                    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                });
                emailSentStatus = true;
                // Update alert with email status
                await Alert.findByIdAndUpdate(newAlert._id, { emailSent: true });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
            }
        } else {
            console.log('Resend API Key missing - skipping email');
        }

        // 4. (REMOVED) Immediate deletion is now handled by the owner via Accept/Reject actions
        // Items stay in PENDING status until owner verifies proof.

        return NextResponse.json({
            message: 'Alert sent successfully. The owner has been notified.',
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error('Error processing alert:', error);
        return NextResponse.json({ error: 'Failed to process alert' }, { status: 500 });
    }
}
