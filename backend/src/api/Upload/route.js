import { NextResponse } from 'next/server';
import { uploadImage } from '@/Backend/Lib/Cloudinary';

export async function POST(request) {
    try {
        // Check if Cloudinary secret is valid
        if (process.env.CLOUDINARY_API_SECRET === '**********' || !process.env.CLOUDINARY_API_SECRET) {
            console.error('Cloudinary API Secret is missing or placeholder!');
            return NextResponse.json(
                { error: 'Cloudinary configuration is incomplete. Please provide a valid API Secret in .env.local' },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to base64 for Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await uploadImage(fileBase64);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
