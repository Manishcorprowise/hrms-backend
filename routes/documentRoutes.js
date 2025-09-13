const express = require('express');
const router = express.Router();
const {uploadDocumentFile,getDocumentFiles} = require('../controller/documentController');
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken);
router.post('/upload/:employeeId', uploadDocumentFile);
router.get('/employee/:employeeId', getDocumentFiles);


module.exports = { documentRoutes: router };
