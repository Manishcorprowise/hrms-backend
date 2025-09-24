const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: Number,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null},
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
});

const optionTypeSchema = new mongoose.Schema({
     code: {
        type: Number,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    typeCode:{
        type:Array,
        default:[]
    },
    description: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null},
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
});

optionTypeSchema.index({ name: 1, isActive: 1 });
optionTypeSchema.index({ isDeleted: 1 });

optionTypeSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastOptionType = await this.constructor.findOne({}, { code: 1 })
            .sort({ code: -1 })
            .lean();

        this.code = lastOptionType ? lastOptionType.code + 1 : 1; // start from 1
    }
    next();
});

const OptionType_Model = mongoose.model('OptionTypes', optionTypeSchema, 'OptionTypes');

typeSchema.index({ name: 1, isActive: 1 });
typeSchema.index({ isDeleted: 1 });

typeSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastType = await this.constructor.findOne({}, { code: 1 })
            .sort({ code: -1 })
            .lean();

        this.code = lastType ? lastType.code + 1 : 1; // start from 1
    }
    next();
});

const Type_Model = mongoose.model('Types', typeSchema, 'Types');

module.exports = { Type_Model,OptionType_Model };
