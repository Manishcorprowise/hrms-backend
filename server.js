const express = require('express');
const { connectDatabase } = require('./dbConfig/db');
const { userRoutes } = require('./routes/userRoutes');
const { personalDetailsRoutes } = require('./routes/personalDetailsRoutes');
const cors = require('cors');
const config = require('./config');
const fileUpload = require('express-fileupload');
const path = require('path');
const { documentRoutes } = require('./routes/documentRoutes');
const { masterRouter } = require('./routes/masterRoutes');
const { requestRouter } = require('./routes/requestRoutes');

const app = express();

// CORS Configuration
app.use(cors());



// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, 
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Static file serving for uploaded files

app.use('/api/files', express.static(path.join(__dirname, 'uploads')));




app.use('/api/employee', userRoutes);
app.use('/api/personal-details', personalDetailsRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/master', masterRouter);
app.use('/api/request', requestRouter);




app.listen(config.server.port, async () => {
  try {
    await connectDatabase();
    console.log(`${config.messages.success.serverRunning} ${config.server.port}`);
  } catch (error) {
    console.log(config.messages.error.serverError, error);
  }
});