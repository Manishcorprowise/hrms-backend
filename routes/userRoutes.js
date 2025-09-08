const express = require('express');
const { createUser, healthCheck, updateUserPassword, loginUser, logoutUser, refreshToken } = require('../controller/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const userRoutes = express.Router();

// Public routes (no authentication required)
userRoutes.get('/health', healthCheck);
userRoutes.post('/login', loginUser);
userRoutes.post('/logout', logoutUser);
userRoutes.post('/refresh-token', refreshToken);

// Protected routes (authentication required)
userRoutes.post('/create', authenticateToken, authorizeRoles(['admin', 'super_admin']), createUser);
userRoutes.put('/update-password', updateUserPassword);

module.exports = {userRoutes};