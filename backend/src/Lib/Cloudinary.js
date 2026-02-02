import { v2 as cloudinary } from 'cloudinary';

let isConfigured = false;

function configureCloudinary() {
    if (isConfigured) return;
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    isConfigured = true;
}

export async function uploadImage(file) {
    configureCloudinary();
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: 'lost-and-found',
            transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        });
        return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}

export async function deleteImage(publicId) {
    configureCloudinary();
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
    }
}

export default cloudinary;
