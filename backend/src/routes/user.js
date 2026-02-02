import express from 'express';
import Alert from '../Models/Alert.js';
import LostItem from '../Models/LostItem.js';
import connectDB from '../Lib/MongoDB.js';
import { sendFoundItemEmail } from '../Lib/Email.js';

const router = express.Router();

// Fetch dashboard data
router.get('/dashboard', async (req, res) => {
    try {
        const { userId } = req.query; // In a real app, from auth middleware

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        await connectDB();

        const [myItems, foundItems, myAlerts] = await Promise.all([
            LostItem.find({ ownerUserId: userId }).sort({ createdAt: -1 }),
            Alert.find({ ownerUserId: userId }).sort({ createdAt: -1 }),
            Alert.find({ finderUserId: userId }).sort({ createdAt: -1 })
        ]);

        res.status(200).json({ myItems, foundItems, myAlerts });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

export default router;
