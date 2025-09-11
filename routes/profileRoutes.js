const express = require('express');
const router = express.Router();
const {
    uploadProfileFile,
    getEmployeeFiles,
    getFileById,
    downloadFile,
    updateFileInfo,
    deleteFile,
    hardDeleteFile,
    getFilesByCategory
} = require('../controller/profileController');
const { authenticateToken } = require('../middlewares/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Upload profile file for an employee
router.post('/upload/:employeeId', uploadProfileFile);

// Get all files for an employee
router.get('/employee/:employeeId', getEmployeeFiles);

// Get file by ID
router.get('/file/:fileId', getFileById);

// Download file
router.get('/download/:fileId', downloadFile);

// Update file information
router.put('/file/:fileId', updateFileInfo);

// Delete file (soft delete)
router.delete('/file/:fileId', deleteFile);

// Hard delete file (permanent)
router.delete('/file/:fileId/hard', hardDeleteFile);

// Get files by category
router.get('/category/:category', getFilesByCategory);

module.exports = { profileRoutes: router };
