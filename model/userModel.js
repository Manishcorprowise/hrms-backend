const { default: mongoose } = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    employeeNumber: {
        type: String,
        required: true
    },
    dateOfJoining: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    manager: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: { type: Boolean, default: false },
    isTemPassword: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
    deletedBy: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: Date.now
    }
    
});

const User_Model = mongoose.model('Users', userSchema, 'Users');

module.exports = { User_Model };