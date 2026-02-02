import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/Backend/Lib/MongoDB';
import LostItem from '@/Backend/Models/LostItem';
import Alert from '@/Backend/Models/Alert';

export async function GET(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Parallel operations for performance
        const [myItems, foundItems, myAlerts] = await Promise.all([
            // 1. My Active Lost Items (Still in feed)
            LostItem.find({ ownerUserId: userId }).sort({ createdAt: -1 }),

            // 2. Items That Were Found (Alerts received by me)
            // These correspond to items I lost that have been found by others
            Alert.find({ ownerUserId: userId }).sort({ createdAt: -1 }),

            // 3. Alerts I Sent (Items I found)
            Alert.find({ finderUserId: userId }).sort({ createdAt: -1 })
        ]);

        return NextResponse.json({
            myItems,
            foundItems,
            myAlerts
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
