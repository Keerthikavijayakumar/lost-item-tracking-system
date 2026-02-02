import express from 'express';
import Alert from '../Models/Alert.js';
import LostItem from '../Models/LostItem.js';
import User from '../Models/User.js';
import connectDB from '../Lib/MongoDB.js';

const router = express.Router();

// Sync user data from Clerk
router.post('/sync', async (req, res) => {
    try {
        const { clerkId, firstName, lastName, email, profileImageUrl } = req.body;

        if (!clerkId || !email) {
            return res.status(400).json({ error: 'Missing required user data' });
        }

        await connectDB();

        const user = await User.findOneAndUpdate(
            { clerkId },
            {
                firstName,
                lastName,
                email,
                profileImageUrl,
                lastLogin: new Date()
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: 'Failed to sync user data' });
    }
});

// Fetch dashboard data
router.get('/dashboard', async (req, res) => {
    try {
        const { userId } = req.query; // Clerk ID

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
