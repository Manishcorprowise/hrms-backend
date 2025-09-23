
const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { createType, getTypes, updateType, deleteType } = require('../controller/masterController');

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles(['admin', 'super_admin']));

router.post('/create-type', createType);
router.get('/get-types', getTypes);
router.post('/update-type', updateType);
router.post('/delete-type', deleteType);



module.exports = { masterRouter: router };
