import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/Backend/Lib/MongoDB';
import LostItem from '@/Backend/Models/LostItem';
import { deleteImage } from '@/Backend/Lib/Cloudinary';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        await connectDB();

        const item = await LostItem.findById(id);

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ item }, { status: 200 });
    } catch (error) {
        console.error('Error fetching item:', error);
        return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Find the item first to check ownership
        const item = await LostItem.findById(id);

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Only allow the owner to delete the item
        if (item.ownerUserId !== userId) {
            return NextResponse.json({ error: 'You are not authorized to delete this item' }, { status: 403 });
        }

        // 1. Delete associated image from Cloudinary if it exists
        if (item.imagePublicId) {
            try {
                await deleteImage(item.imagePublicId);
            } catch (imageError) {
                console.error('Failed to delete image from Cloudinary:', imageError);
                // We'll continue with DB deletion even if image deletion fails
            }
        }

        // 2. Delete the item from MongoDB
        await LostItem.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Item deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting lost item:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
