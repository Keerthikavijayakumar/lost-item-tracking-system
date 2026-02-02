import express from 'express';
import LostItem from '../Models/LostItem.js';
import connectDB from '../Lib/MongoDB.js';

const router = express.Router();

// GET all lost items with filters
router.get('/', async (req, res) => {
    try {
        await connectDB();
        const { category, search, date, sort } = req.query;

        let query = {};
        if (category && category !== 'all') query.category = category;
        if (date) query.dateLost = date;
        if (search) {
            query.$or = [
                { itemName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { lastSeenLocation: { $regex: search, $options: 'i' } },
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        else if (sort === 'dateLost') sortOption = { dateLost: -1 };

        const items = await LostItem.find(query).sort(sortOption);
        res.status(200).json({ items });
    } catch (error) {
        console.error('Error fetching lost items:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch items' });
    }
});

// GET single lost item
router.get('/:id', async (req, res) => {
    try {
        await connectDB();
        const item = await LostItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// POST new lost item
router.post('/', async (req, res) => {
    try {
        await connectDB();
        const { userId, userEmail, ...itemData } = req.body; // In a real app, userId should come from auth middleware

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const newItem = await LostItem.create({
            ...itemData,
            ownerUserId: userId,
            ownerEmail: userEmail,
        });

        res.status(201).json({ message: 'Lost item posted successfully', item: newItem });
    } catch (error) {
        console.error('Error creating lost item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// DELETE lost item
router.delete('/:id', async (req, res) => {
    try {
        await connectDB();
        const { userId } = req.query; // Verification from frontend
        const item = await LostItem.findById(req.params.id);

        if (!item) return res.status(404).json({ error: 'Item not found' });
        if (item.ownerUserId !== userId) return res.status(401).json({ error: 'Unauthorized' });

        if (item.imagePublicId) {
            try { await deleteImage(item.imagePublicId); } catch (e) { console.error(e); }
        }

        await LostItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default router;
