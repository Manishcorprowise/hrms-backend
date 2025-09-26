const { default: mongoose } = require("mongoose");
const { Type_Model, OptionType_Model } = require("../model/masterModel");



module.exports={
    async createType(req,res){
        try {
            const {  name, description } = req.body;
            console.log("Request Body:", req.body);
            const createdBy = new mongoose.Types.ObjectId(req.user.id);
            const savedService = await Type_Model.create({
                name,
                description,
                createdBy,
        });
        return res.status(200).json({
            status: true,
            message: "Type added successfully",
            data: savedService
        });
        } catch (error) {
            console.error("Error adding type:", error.message);
            return res
                .status(203)
                .json({ status: false, message: "Internal Server Error" });
        }
    },
    async getTypes(req,res){
        try {
            // Logic to get types
            const types = await Type_Model.find({ isDeleted: false });
            return res.status(200).json({
                status: true,
                message: "Types fetched successfully",
                data: types
            });

        } catch (error) {
            console.error('Error in getTypes:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },
    async updateType(req,res){
        try {
            const { id, name, description } = req.body;
            const updatedBy = new mongoose.Types.ObjectId(req.user.id);
            const updatedType = await Type_Model.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { name, description, updatedBy, updatedAt: new Date() },
                { new: true }
            );

            if (!updatedType) {
                return res.status(203).json({ status: false, message: 'Type not found or already deleted' });
            }

            return res.status(200).json({
                status: true,
                message: 'Type updated successfully',
                data: updatedType
            });
            // Logic to update type
        } catch (error) {
            console.error('Error in updateType:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },
    async deleteType(req,res){
        try {
            // Logic to delete type
            const { id } = req.body;
            const deletedBy = new mongoose.Types.ObjectId(req.user.id);
            const deletedType = await Type_Model.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { isDeleted: true, deletedAt: new Date(), deletedBy },
                { new: true }
            );

            if (!deletedType) {
                return res.status(203).json({ status: false, message: 'Type not found or already deleted' });
            }

            return res.status(200).json({
                status: true,
                message: 'Type deleted successfully',
                data: deletedType
            });
        } catch (error) {
            console.error('Error in deleteType:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },

    // Option Type Controllers
    async createOptionType(req,res){
        try {
            const {  name, typeCode, description } = req.body;
            console.log("Request Body:", req.body);
            const createdBy = new mongoose.Types.ObjectId(req.user.id);
            const savedOptionType = await OptionType_Model.create({
                name,
                typeCode,
                description,
                createdBy,
        });
        return res.status(200).json({
            status: true,
            message: "Option Type added successfully",
            data: savedOptionType
        });
        } catch (error) {
            console.error("Error adding option type:", error.message);
            return res
                .status(203)
                .json({ status: false, message: "Internal Server Error" });
        }
    },
    async getOptionTypes(req,res){
        try {
            // Logic to get option types
            const optionTypes = await OptionType_Model.find({ isDeleted: false });

            return res.status(200).json({
                status: true,
                message: "Option Types fetched successfully",
                data: optionTypes
            });

        } catch (error) {
            console.error('Error in getOptionTypes:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },
    async updateOptionType(req,res){
        try {
            const { id, name, typeCode, description } = req.body;
            const updatedBy = new mongoose.Types.ObjectId(req.user.id);
            const updatedOptionType = await OptionType_Model.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { name, typeCode, description, updatedBy, updatedAt: new Date() },
                { new: true }
            );

            if (!updatedOptionType) {
                return res.status(203).json({ status: false, message: 'Option Type not found or already deleted' });
            }

            return res.status(200).json({
                status: true,
                message: 'Option Type updated successfully',
                data: updatedOptionType
            });
            // Logic to update option type
        } catch (error) {
            console.error('Error in updateOptionType:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },
    async deleteOptionType(req,res){
        try {
            // Logic to delete option type
            const { id } = req.body;
            const deletedBy = new mongoose.Types.ObjectId(req.user.id);
            const deletedOptionType = await OptionType_Model.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { isDeleted: true, deletedAt: new Date(), deletedBy },
                { new: true }
            );

            if (!deletedOptionType) {
                return res.status(203).json({ status: false, message: 'Option Type not found or already deleted' });
            }

            return res.status(200).json({
                status: true,
                message: 'Option Type deleted successfully',
                data: deletedOptionType
            });
        } catch (error) {
            console.error('Error in deleteOptionType:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },

    async getOptionTypeCode(req,res){
        try {
            const { typeCode } = req.query; // Expecting typeCode as a comma-separated string
            let code  = [+typeCode];
            if (!typeCode) {
                return res.status(400).json({ status: false, message: 'typeCode query parameter is required' });
            }
            const optionTypes = await OptionType_Model.find({
                typeCode: { $in: code },
                isDeleted: false
            }).select('code name');
            return res.status(200).json({
                status: true,
                message: 'Option Types fetched successfully',
                data: optionTypes
            });
        } catch (error) {
            console.error('Error in getOptionTypeCode:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    }
}