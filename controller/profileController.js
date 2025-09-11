const { Profile_Model } = require('../model/profileModel');
const { User_Model } = require('../model/userModel');
const { default: mongoose } = require('mongoose');
const path = require('path');
const fs = require('fs');

module.exports = {
    // Upload profile file
    async uploadProfileFile(req, res) {
        try {
            const { employeeId } = req.params;
            const { fileType, category, description } = req.body || {};

            console.log('Upload request received:', {
                employeeId,
                body: req.body,
                files: req.files ? Object.keys(req.files) : 'No files',
                fileType,
                category,
                description
            });

            // Check if employee exists
            const employee = await User_Model.findById(employeeId);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            if (!req.files || !req.files.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                    debug: {
                        hasFiles: !!req.files,
                        fileKeys: req.files ? Object.keys(req.files) : 'No files object'
                    }
                });
            }

            const file = req.files.file;
            const fileExtension = path.extname(file.name);
            const fileName = `${employeeId}_${Date.now()}${fileExtension}`;
            
            // Create directory structure
            const uploadDir = path.join(__dirname, '..', 'uploads', 'profiles', employeeId.toString());
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            
            // Move file to upload directory
            file.mv(filePath, async (err) => {
                if (err) {
                    console.error('Error moving file:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error uploading file',
                        error: err.message
                    });
                }

                try {
                    // Save file information to database
                    const profileFile = new Profile_Model({
                        employeeId,
                        fileName,
                        originalName: file.name,
                        filePath: `profiles/${employeeId}/${fileName}`,
                        fileSize: file.size,
                        mimeType: file.mimetype,
                        fileType: fileType || 'other',
                        category: category || 'personal',
                        description,
                        uploadedBy: req.user.id
                    });

                    await profileFile.save();

                    res.status(201).json({
                        success: true,
                        message: 'File uploaded successfully',
                        data: {
                            id: profileFile._id,
                            fileName: profileFile.fileName,
                            originalName: profileFile.originalName,
                            filePath: profileFile.filePath,
                            fileSize: profileFile.fileSize,
                            mimeType: profileFile.mimeType,
                            fileType: profileFile.fileType,
                            category: profileFile.category,
                            description: profileFile.description,
                            uploadedAt: profileFile.createdAt
                        }
                    });
                } catch (dbError) {
                    console.error('Database error:', dbError);
                    // Clean up uploaded file if database save fails
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    res.status(500).json({
                        success: false,
                        message: 'Error saving file information',
                        error: dbError.message
                    });
                }
            });
        } catch (error) {
            console.error('Error uploading profile file:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get all files for an employee
    async getEmployeeFiles(req, res) {
        try {
            const { employeeId } = req.params;
            const { category, fileType } = req.query;

            let query = { employeeId, isDeleted: false };

            if (category) {
                query.category = category;
            }
            if (fileType) {
                query.fileType = fileType;
            }

            const files = await Profile_Model.find(query)
                .populate('uploadedBy', 'employeeName')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: files
            });
        } catch (error) {
            console.error('Error fetching employee files:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get file by ID
    async getFileById(req, res) {
        try {
            const { fileId } = req.params;

            const file = await Profile_Model.findById(fileId)
                .populate('employeeId', 'employeeName employeeNumber')
                .populate('uploadedBy', 'employeeName');

            if (!file || file.isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            res.status(200).json({
                success: true,
                data: file
            });
        } catch (error) {
            console.error('Error fetching file:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Download file
    async downloadFile(req, res) {
        try {
            const { fileId } = req.params;

            const file = await Profile_Model.findById(fileId);
            if (!file || file.isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            const fullPath = path.join(__dirname, '..', 'uploads', file.filePath);
            
            if (!fs.existsSync(fullPath)) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found on server'
                });
            }

            res.download(fullPath, file.originalName);
        } catch (error) {
            console.error('Error downloading file:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Update file information
    async updateFileInfo(req, res) {
        try {
            const { fileId } = req.params;
            const { fileType, category, description } = req.body;

            const file = await Profile_Model.findByIdAndUpdate(
                fileId,
                { 
                    fileType, 
                    category, 
                    description,
                    updatedBy: req.user.id,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );

            if (!file || file.isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'File information updated successfully',
                data: file
            });
        } catch (error) {
            console.error('Error updating file info:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Delete file (soft delete)
    async deleteFile(req, res) {
        try {
            const { fileId } = req.params;

            const file = await Profile_Model.findByIdAndUpdate(
                fileId,
                { 
                    isDeleted: true,
                    deletedBy: req.user.id,
                    deletedAt: new Date()
                },
                { new: true }
            );

            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'File deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Hard delete file (removes from server and database)
    async hardDeleteFile(req, res) {
        try {
            const { fileId } = req.params;

            const file = await Profile_Model.findById(fileId);
            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            // Delete file from server
            const fullPath = path.join(__dirname, '..', 'uploads', file.filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }

            // Delete from database
            await Profile_Model.findByIdAndDelete(fileId);

            res.status(200).json({
                success: true,
                message: 'File permanently deleted'
            });
        } catch (error) {
            console.error('Error hard deleting file:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get files by category
    async getFilesByCategory(req, res) {
        try {
            const { category } = req.params;
            const { employeeId } = req.query;

            let query = { category, isDeleted: false };
            if (employeeId) {
                query.employeeId = employeeId;
            }

            const files = await Profile_Model.find(query)
                .populate('employeeId', 'employeeName employeeNumber')
                .populate('uploadedBy', 'employeeName')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: files
            });
        } catch (error) {
            console.error('Error fetching files by category:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

