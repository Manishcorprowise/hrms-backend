const { default: mongoose } = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        
        unique: true
    },
    // Personal Information
    dateOfBirth: {
        type: Date
    },
    nationality: {
        type: String
    },
    maritalStatus: {
        type: String,
    },
    placeOfBirth: {
        type: String
    },
    residentialStatus: {
        type: String,
    },
    fatherName: {
        type: String
    },
    motherName: {
        type: String
    },
    spouseName: {
        type: String
    },
    height: {
        type: String
    },
    weight: {
        type: String
    },
    identificationMark: {
        type: String
    },
    hobby: {
        type: String
    },
    bloodGroup: {
        type: String,
    },
    emergencyContact: {
        name: {
            type: String
        },
        relationship: {
            type: String
        },
        phone: {
            type: String
        },
        email: {
            type: String
        }
    },
    address: {
        type: String
    },
    // Education Details
    education: [{
        qualification: {
            type: String
        },
        specialization: {
            type: String
        },
        institution: {
            type: String
        },
        board: {
            type: String
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        grade: {
            type: String
        },
        modeOfStudy: {
            type: String,
        },
        country: {
            type: String
        },
        status: {
            type: String,
        }
    }],
    // System fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

});

// Indexes for better query performance
personalDetailsSchema.index({ 'education.qualification': 1 });

const PersonalDetails_Model = mongoose.model('PersonalDetails', personalDetailsSchema, 'PersonalDetails');

module.exports = { PersonalDetails_Model };

