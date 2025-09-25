const { default: mongoose } = require('mongoose');

const requestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestTypeCode: {
        type: Number,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
        required: true, 
    },
    fileName: {
        type: String,
    },
    filePath: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    updatedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    reply:{
        type: String,
        default:''
    }

});

// Index for better query performance
requestSchema.index({ employeeId: 1, fileType: 1, isActive: 1 });
requestSchema.index({ employeeId: 1, category: 1, isActive: 1 });
requestSchema.index({ isDeleted: 1 });

const Request_Model = mongoose.model('Requests', requestSchema, 'Requests');

module.exports = { Request_Model };