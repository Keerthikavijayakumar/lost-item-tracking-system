import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
    // Copied from LostItem before deletion for historical record
    itemName: {
        type: String,
        required: true,
    },
    itemDescription: {
        type: String,
        required: true,
    },
    ownerEmail: {
        type: String,
        required: true,
    },
    ownerUserId: {
        type: String,
        required: true,
    },
    finderName: {
        type: String,
        required: [true, 'Finder name is required'],
    },
    finderDepartment: {
        type: String,
        required: [true, 'Finder department is required'],
    },
    // Finder information
    finderEmail: {
        type: String,
        required: [true, 'Finder email is required'],
    },
    finderUserId: {
        type: String,
        required: [true, 'Finder user ID is required'],
    },
    foundLocation: {
        type: String,
        required: [true, 'Found location is required'],
        trim: true,
    },
    dateFound: {
        type: Date,
        required: [true, 'Date found is required'],
    },
    additionalNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    // Proof and Verification
    proofImageUrl: {
        type: String,
        required: [true, 'Proof image is required'],
    },
    uniqueIdentifierDescription: {
        type: String,
        required: [true, 'Identifier description is required'],
        trim: true,
    },
    finderPhoneNumber: {
        type: String,
        required: [true, 'Finder phone number is required'],
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING',
    },
    actionToken: {
        type: String,
        sparse: true, // Only for pending actions
    },
    expiresAt: {
        type: Date,
    },
    lostItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LostItem',
        required: true,
    },
    emailSent: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Alert || mongoose.model('Alert', AlertSchema);
