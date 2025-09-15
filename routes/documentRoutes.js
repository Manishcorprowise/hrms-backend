const express = require('express');
const router = express.Router();
const {uploadDocumentFile,getDocumentFiles} = require('../controller/documentController');
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken);
router.post('/upload', uploadDocumentFile);
router.get('/get-files', getDocumentFiles);


module.exports = { documentRoutes: router };
