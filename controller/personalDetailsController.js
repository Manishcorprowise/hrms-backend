const { PersonalDetails_Model } = require('../model/personalDetailsModel');
const { User_Model } = require('../model/userModel');
const { default: mongoose } = require('mongoose');

module.exports = {
    // Create personal details for an employee
    async createPersonalDetails(req, res) {
        try {
            const { employeeId } = req.params;
            const personalData = req.body;

            // Check if employee exists
            const employee = await User_Model.findById(employeeId);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            // Check if personal details already exist
            const existingDetails = await PersonalDetails_Model.findOne({ employeeId });
            if (existingDetails) {
                return res.status(400).json({
                    success: false,
                    message: 'Personal details already exist for this employee'
                });
            }

            const personalDetails = new PersonalDetails_Model({
                employeeId,
                ...personalData,
                createdBy: req.user.id,
                updatedBy: req.user.id
            });

            await personalDetails.save();

            res.status(201).json({
                success: true,
                message: 'Personal details created successfully',
                data: personalDetails
            });
        } catch (error) {
            console.error('Error creating personal details:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },
    // Get personal details by employee ID
    async getPersonalDetails(req, res) {
        try {
            const { employeeId } = req.params;

            const personalDetails = await PersonalDetails_Model.findOne({ 
                employeeId, 
            }).populate('employeeId', 'employeeName employeeNumber email phone position department');

            if (!personalDetails) {
                // Return empty personal details structure instead of 404
                return res.status(200).json({
                    success: true,
                    data: null
                });
            }

            res.status(200).json({
                success: true,
                data: personalDetails
            });
        } catch (error) {
            console.error('Error fetching personal details:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },
    // Update personal details
    async updatePersonalDetails(req, res) {
        try {
            const { employeeId } = req.params;
            const updateData = req.body;
            console.log(updateData,'updateData');

            const personalDetails = await PersonalDetails_Model.findOneAndUpdate(
                { employeeId },
                { 
                    ...updateData, 
                    updatedBy: req.user.id,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );

            if (!personalDetails) {
                return res.status(404).json({
                    success: false,
                    message: 'Personal details not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Personal details updated successfully',
                data: personalDetails
            });
        } catch (error) {
            console.error('Error updating personal details:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },



};

