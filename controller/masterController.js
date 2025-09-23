const { default: mongoose } = require("mongoose");
const { Type_Model } = require("../model/masterModel");



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

}