const { default: mongoose } = require('mongoose');

const documentSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['profile-picture', 'document', 'certificate', 'id-proof', 'address-proof', 'education-certificate', 'experience-letter', 'other'],
        default: 'profile-picture'
    },
    category: {
        type: String,
        enum: ['professional', 'personal', 'tax', 'employment', 'bank', 'photos', 'education', 'identity'],
        default: 'personal'
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
});

// Index for better query performance
documentSchema.index({ employeeId: 1, fileType: 1, isActive: 1 });
documentSchema.index({ employeeId: 1, category: 1, isActive: 1 });
documentSchema.index({ isDeleted: 1 });

const Document_Model = mongoose.model('Documents', documentSchema, 'Documents');

module.exports = { Document_Model };