import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        console.log('Connecting to MongoDB...');
        cached.conn = await cached.promise;
        console.log('Successfully connected to MongoDB');
    } catch (e) {
        console.error('Failed to connect to MongoDB:', e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
