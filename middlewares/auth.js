const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { User_Model } = require('../model/userModel');
const config = require('../config');

/**
 * Authentication middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(config.statusCodes.unauthorized).json({
                message: config.messages.error.tokenRequired,
                error: 'No token provided'
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Check if user still exists and is active
        const user = await User_Model.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(config.statusCodes.unauthorized).json({
                message: config.messages.error.userNotFound,
                error: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(config.statusCodes.forbidden).json({
                message: config.messages.error.unauthorized,
                error: 'Account is deactivated'
            });
        }

        // Add user info to request object
        req.user = {
            id: user._id,
            email: user.email,
            userName: user.userName,
            role: user.role,
            employeeName: user.employeeName,
            employeeNumber: user.employeeNumber,
            isTemPassword: user.isTemPassword
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(config.statusCodes.unauthorized).json({
            message: config.messages.error.invalidToken,
            error: error.message
        });
    }
};

/**
 * Authorization middleware to check user roles
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} - Middleware function
 */
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(config.statusCodes.unauthorized).json({
                message: config.messages.error.unauthorized,
                error: 'User not authenticated'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(config.statusCodes.forbidden).json({
                message: config.messages.error.unauthorized,
                error: 'Insufficient permissions'
            });
        }

        next();
    };
};

/**
 * Middleware to check if user has changed temporary password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requirePasswordChange = (req, res, next) => {
    if (req.user && req.user.isTemPassword) {
        return res.status(config.statusCodes.badRequest).json({
            message: 'Password change required',
            error: 'Please change your temporary password before accessing this resource',
            requiresPasswordChange: true
        });
    }
    next();
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (token) {
            const decoded = verifyToken(token);
            const user = await User_Model.findById(decoded.id).select('-password');
            
            if (user && user.isActive) {
                req.user = {
                    id: user._id,
                    email: user.email,
                    userName: user.userName,
                    role: user.role,
                    employeeName: user.employeeName,
                    employeeNumber: user.employeeNumber,
                    isTemPassword: user.isTemPassword
                };
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    requirePasswordChange,
    optionalAuth
};
