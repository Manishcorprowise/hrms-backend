const express = require('express');
const router = express.Router();
const {
    createPersonalDetails,
    getPersonalDetails,
    updatePersonalDetails,
    
    getAllPersonalDetails,
    searchPersonalDetails
} = require('../controller/personalDetailsController');
const { authenticateToken } = require('../middlewares/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all personal details with pagination
router.get('/', getAllPersonalDetails);

// Search personal details
router.get('/search', searchPersonalDetails);

// Create personal details for an employee
router.post('/:employeeId', createPersonalDetails);

// Get personal details by employee ID
router.get('/:employeeId', getPersonalDetails);

// Update personal details
router.put('/:employeeId', updatePersonalDetails);

// Delete personal details (soft delete)
// router.delete('/:employeeId', deletePersonalDetails);

module.exports = { personalDetailsRoutes: router };
