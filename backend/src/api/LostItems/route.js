import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/Backend/Lib/MongoDB';
import LostItem from '@/Backend/Models/LostItem';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const date = searchParams.get('date');
        const sort = searchParams.get('sort') || 'newest';

        let query = {};

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by date
        if (date) {
            query.dateLost = date;
        }

        // Search query (itemName, description, location)
        if (search) {
            query.$or = [
                { itemName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { lastSeenLocation: { $regex: search, $options: 'i' } },
            ];
        }

        // Sorting
        let sortOption = {};
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'dateLost') {
            sortOption = { dateLost: -1 };
        } else {
            sortOption = { createdAt: -1 }; // Default: Newest first
        }

        const items = await LostItem.find(query).sort(sortOption);

        return NextResponse.json({ items }, { status: 200 });
    } catch (error) {
        console.error('Error fetching lost items:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch items' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();

        // Validate required fields
        const requiredFields = ['itemName', 'category', 'description', 'dateLost', 'lastSeenLocation'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
            }
        }

        const email = user.emailAddresses[0]?.emailAddress;

        const newItem = await LostItem.create({
            ...body,
            ownerUserId: userId,
            ownerEmail: email,
        });

        return NextResponse.json({
            message: 'Lost item posted successfully',
            item: newItem
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating lost item:', error);
        return NextResponse.json({
            error: error.message || 'Failed to create item',
            details: error.errors ? Object.keys(error.errors).map(key => error.errors[key].message) : null
        }, { status: 500 });
    }
}
