const express = require('express');
const { createUser, healthCheck, updateUserPassword, loginUser, logoutUser, refreshToken, getAllUsers, getUserById, updateUser } = require('../controller/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const userRoutes = express.Router();

// Public routes (no authentication required)
userRoutes.get('/health', healthCheck);
userRoutes.post('/login', loginUser);
userRoutes.post('/logout', logoutUser);
userRoutes.post('/refresh-token', refreshToken);

// Protected routes (authentication required)
userRoutes.post('/create', authenticateToken, authorizeRoles(['admin', 'super_admin']), createUser);
userRoutes.patch('/update-user/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), updateUser);
userRoutes.put('/update-password', updateUserPassword);
userRoutes.get('/all-users', authenticateToken, authorizeRoles(['admin', 'super_admin']), getAllUsers);
userRoutes.get('/get-user/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), getUserById);
module.exports = {userRoutes};