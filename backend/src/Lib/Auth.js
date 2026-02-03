import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        try {
            // Verify the token with Clerk
            const decoded = await clerkClient.verifyToken(token);
            req.auth = decoded;
            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
