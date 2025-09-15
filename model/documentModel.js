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
    filePath: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Index for better query performance
documentSchema.index({ employeeId: 1, fileType: 1, isActive: 1 });
documentSchema.index({ employeeId: 1, category: 1, isActive: 1 });
documentSchema.index({ isDeleted: 1 });

const Document_Model = mongoose.model('Documents', documentSchema, 'Documents');

module.exports = { Document_Model };