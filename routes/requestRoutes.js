
const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { get } = require('mongoose');
const { createRequest, getRequest, updateRequest, deleteRequest, getRequestsForManager, respondRequest } = require('../controller/requestController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.post('/create-request', createRequest);
router.get('/get-request', getRequest);
router.post('/update-request', updateRequest);
router.post('/delete-request', deleteRequest);

// Manager / Admin endpoints
router.get('/get-requests-for-manager', getRequestsForManager);
router.post('/respond-request', authorizeRoles(['admin', 'super_admin', 'manager']), respondRequest);





module.exports = { requestRouter: router };
