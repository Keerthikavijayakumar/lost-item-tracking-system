import express from 'express';
import multer from 'multer';
import { uploadImage } from '../Lib/Cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (process.env.CLOUDINARY_API_SECRET === '**********' || !process.env.CLOUDINARY_API_SECRET) {
            return res.status(500).json({ error: 'Cloudinary configuration is incomplete.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await uploadImage(fileBase64);

        res.status(200).json(result);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
});

export default router;
