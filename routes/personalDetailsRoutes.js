const express = require('express');
const router = express.Router();
const {
    createPersonalDetails,
    getPersonalDetails,
    updatePersonalDetails,
} = require('../controller/personalDetailsController');
const { authenticateToken } = require('../middlewares/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.post('/:employeeId', createPersonalDetails);
router.get('/:employeeId', getPersonalDetails);
router.put('/:employeeId', updatePersonalDetails);



module.exports = { personalDetailsRoutes: router };
