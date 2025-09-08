const config = {
  // Server Configuration
  server: {
    port: 3000,
    host: 'localhost',
    environment: 'development',
    baseUrl: 'http://localhost:3000'
  },

  // Database Configuration
  database: {
    mongodb: {
      uri: 'mongodb://localhost:27017/hrmsDB',
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
      'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
    secret: 'your-super-secret-jwt-key-change-this-in-production-hrms-2024',
    expiresIn: '24h',
    refreshExpiresIn: '7d',
    issuer: 'hrms-app',
    audience: 'hrms-users'
  },

  // Email Configuration
  email: {
    service: 'gmail',
    auth: {
      user: 'noreplykadconnect@gmail.com',
      pass: 'lwnknrsezrihujas'
    }
  },

  // Response Messages
  messages: {
    success: {
      serverRunning: 'Server is running on port',
      loginSuccess: 'Login successful',
      logoutSuccess: 'Logout successful',
      tokenRefreshed: 'Token refreshed successfully'
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
