import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    profileImageUrl: String,
    role: {
        type: String,
        default: 'student'
    },
    department: String,
    phoneNumber: String,
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
