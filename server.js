const express = require('express');
const { connectDatabase } = require('./dbConfig/db');
const { userRoutes } = require('./routes/userRoutes');
const cors = require('cors');
const config = require('./config');

const app = express();

// CORS Configuration
app.use(cors(config.cors));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/employee', userRoutes);
app.listen(config.server.port, async () => {
  try {
    await connectDatabase();
    console.log(`${config.messages.success.serverRunning} ${config.server.port}`);
  } catch (error) {
    console.log(`${config.messages.error.serverError} ${error}`);
  }
});