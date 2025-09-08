const express = require('express');
const { createUser, healthCheck } = require('../controller/userController');

const userRoutes = express.Router();

// Health check endpoint
userRoutes.get('/health', healthCheck);

// userRoutes.post('/login', loginUser);

userRoutes.post('/create', createUser);

module.exports = {userRoutes};