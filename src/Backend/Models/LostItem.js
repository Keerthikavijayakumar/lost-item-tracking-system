import mongoose from 'mongoose';

const LostItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Other'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    dateLost: {
        type: Date,
        required: [true, 'Date lost is required'],
    },
    lastSeenLocation: {
        type: String,
        required: [true, 'Last seen location is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    ownerEmail: {
        type: String,
        required: [true, 'Owner email is required'],
        trim: true,
    },
    ownerUserId: {
        type: String,
        required: [true, 'Owner user ID is required'],
    },
    imageUrl: {
        type: String,
        default: null,
    },
    imagePublicId: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

// Add text index for search functionality
LostItemSchema.index({ itemName: 'text', description: 'text', lastSeenLocation: 'text' });

export default mongoose.models.LostItem || mongoose.model('LostItem', LostItemSchema);
