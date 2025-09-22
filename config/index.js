require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.SERVER_HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development',
    baseUrl: process.env.SERVER_BASE_URL || 'http://localhost:3000'
  },

  // Database Configuration
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hrmsDB',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },

  // CORS Configuration
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      /\.ngrok-free\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-File-Base-Url', 'X-Frontend-Base-Url']
  },

  // Response Messages
  messages: {
    success: {
      serverRunning: 'Server is running on port'
    },
    error: {
      validation: 'All fields are required',
      serverError: 'Internal server error',
      databaseError: 'Something went wrong while connecting to database',
      databaseConnected: 'Database connected'
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-hrms-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'hrms-app',
    audience: process.env.JWT_AUDIENCE || 'hrms-users'
  },

  // Email Configuration
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'noreplykadconnect@gmail.com',
      pass: process.env.EMAIL_PASS || 'lwnknrsezrihujas'
    }
  },

  // File Upload Configuration
  fileUpload: {
    baseUrl: process.env.FILE_BASE_URL || 'http://localhost:3000/api/files/',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800, // 50MB
    uploadPath: process.env.UPLOAD_PATH || 'uploads'
  },

  // Response Messages
  messages: {
    success: {
      serverRunning: 'Server is running on port',
      loginSuccess: 'Login successful',
      logoutSuccess: 'Logout successful',
      tokenRefreshed: 'Token refreshed successfully',
      databaseConnected: 'Database connected successfully'
    },
    error: {
      validation: 'All fields are required',
      serverError: 'Internal server error',
      databaseError: 'Something went wrong while connecting to database',
      databaseConnected: 'Database connected',
      invalidCredentials: 'Invalid email or password',
      userNotFound: 'User not found',
      tokenRequired: 'Access token is required',
      invalidToken: 'Invalid or expired token',
      unauthorized: 'Unauthorized access',
      accountLocked: 'Account is locked due to multiple failed login attempts'
    }
  },

  // HTTP Status Codes
  statusCodes: {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    serverError: 500
  }

};

module.exports = config;
