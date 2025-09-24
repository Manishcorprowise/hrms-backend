
const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { createType, getTypes, updateType, deleteType, createOptionType, getOptionTypes, updateOptionType, deleteOptionType, getOptionTypeCode } = require('../controller/masterController');
const { get } = require('mongoose');

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles(['admin', 'super_admin']));

router.post('/create-type', createType);
router.get('/get-types', getTypes);
router.post('/update-type', updateType);
router.post('/delete-type', deleteType);


router.post('/create-optiontype', createOptionType);
router.get('/get-optiontype', getOptionTypes);
router.post('/update-optiontype', updateOptionType);
router.post('/delete-optiontype', deleteOptionType);

// From frontend we get the type code we have to fetch the option which have those type codes

router.get('/get-option-by-typecodes', getOptionTypeCode);



module.exports = { masterRouter: router };
