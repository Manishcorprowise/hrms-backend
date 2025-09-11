const express = require('express');
const { connectDatabase } = require('./dbConfig/db');
const { userRoutes } = require('./routes/userRoutes');
const { personalDetailsRoutes } = require('./routes/personalDetailsRoutes');
const { profileRoutes } = require('./routes/profileRoutes');
const cors = require('cors');
const config = require('./config');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // If no origin (mobile apps, curl, Postman), allow
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://5b6e90335985.ngrok-free.app"
      ];

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check if it's an ngrok URL (dynamic ngrok URLs)
      if (/^https:\/\/[a-z0-9-]+\.ngrok-free\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Check if it's a localhost with different port
      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      // Check if it's 127.0.0.1 with different port
      if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);



// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Static file serving for uploaded files
app.use('/api/files', express.static(path.join(__dirname, 'uploads')));

// Additional CORS headers for ngrok
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});



app.use('/api/employee', userRoutes);
app.use('/api/personal-details', personalDetailsRoutes);
app.use('/api/profile', profileRoutes);




app.listen(config.server.port, async () => {
  try {
    await connectDatabase();
    console.log(`${config.messages.success.serverRunning} ${config.server.port}`);
  } catch (error) {
    console.log(config.messages.error.serverError, error);
  }
});