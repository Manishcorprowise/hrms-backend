const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate JWT token for user
 * @param {Object} user - User object with id, email, userName, role
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        employeeName: user.employeeName,
        employeeNumber: user.employeeNumber
    };

    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
        issuer: config.jwt.issuer,
        audience: config.jwt.audience
    });
};

/**
 * Generate refresh token for user
 * @param {Object} user - User object with id
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (user) => {
    const payload = {
        id: user._id,
        type: 'refresh'
    };

    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.refreshExpiresIn,
        issuer: config.jwt.issuer,
        audience: config.jwt.audience
    });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret, {
            issuer: config.jwt.issuer,
            audience: config.jwt.audience
        });
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object} - Decoded token payload
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if expired, false otherwise
 */
const isTokenExpired = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return true;
        
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    
    return parts[1];
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} user - User object
 * @returns {Object} - Object containing accessToken and refreshToken
 */
const generateTokenPair = (user) => {
    return {
        accessToken: generateToken(user),
        refreshToken: generateRefreshToken(user),
        tokenType: 'Bearer',
        expiresIn: config.jwt.expiresIn
    };
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    decodeToken,
    isTokenExpired,
    extractTokenFromHeader,
    generateTokenPair
};
