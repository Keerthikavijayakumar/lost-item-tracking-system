import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Lib/MongoDB.js';
import lostItemsRouter from './routes/lostItems.js';
import alertsRouter from './routes/alerts.js';
import uploadRouter from './routes/upload.js';
import userRouter from './routes/user.js';
import alertOwnerRouter from './routes/alertOwner.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/lost-items', lostItemsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/user', userRouter);
app.use('/api/alert-owner', alertOwnerRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
