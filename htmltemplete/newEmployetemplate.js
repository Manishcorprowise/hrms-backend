const config = require('../config');

/**
 * Generate HTML email template for new employee with login credentials and password reset link
 * @param {string} userName - Generated username for the employee
 * @param {string} tempPassword - Temporary password
 * @param {string} employeeName - Full name of the employee
 * @param {string} resetToken - Password reset token (optional)
 * @returns {string} - Complete HTML email template
 */
const generateNewEmployeeEmailTemplate = (userName, tempPassword, employeeName, resetToken = null) => {
    // Generate password reset link
    const resetLink = resetToken 
        ? `${req.headers['x-frontend-base-url']}/reset-password?token=${resetToken}`
        : `${req.headers['x-frontend-base-url']}/login`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HRMS Portal</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-message {
                font-size: 18px;
                margin-bottom: 30px;
                color: #2c3e50;
            }
            .credentials-box {
                background-color: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
            }
            .credential-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #dee2e6;
            }
            .credential-item:last-child {
                border-bottom: none;
            }
            .credential-label {
                font-weight: 600;
                color: #495057;
                font-size: 16px;
            }
            .credential-value {
                font-family: 'Courier New', monospace;
                background-color: #e9ecef;
                padding: 8px 12px;
                border-radius: 4px;
                font-weight: bold;
                color: #212529;
                font-size: 14px;
            }
            .action-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.2s ease;
            }
            .action-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .security-notice {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .security-notice h4 {
                margin: 0 0 10px 0;
                color: #856404;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
            }
            .footer a {
                color: #667eea;
                text-decoration: none;
            }
            .steps {
                background-color: #e3f2fd;
                border-left: 4px solid #2196f3;
                padding: 20px;
                margin: 20px 0;
            }
            .steps h4 {
                margin: 0 0 15px 0;
                color: #1976d2;
            }
            .steps ol {
                margin: 0;
                padding-left: 20px;
            }
            .steps li {
                margin: 8px 0;
                color: #424242;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏢 HRMS Portal</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Human Resource Management System</p>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    <h2>Welcome to HRMS Portal, ${employeeName}!</h2>
                    <p>Your account has been successfully created. Below are your login credentials to access the HRMS portal.</p>
                </div>

                <div class="credentials-box">
                    <h3 style="margin: 0 0 20px 0; color: #495057; text-align: center;">🔐 Your Login Credentials</h3>
                    <div class="credential-item">
                        <span class="credential-label">Username:</span>
                        <span class="credential-value">${userName}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Temporary Password:</span>
                        <span class="credential-value">${tempPassword}</span>
                    </div>
                </div>

                <div class="steps">
                    <h4>📋 Next Steps:</h4>
                    <ol>
                        <li>Click the "Access HRMS Portal" button below</li>
                        <li>Login using the credentials provided above</li>
                        <li>Change your password immediately for security</li>
                        <li>Complete your profile setup</li>
                        <li>Explore the HRMS features available to you</li>
                    </ol>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" class="action-button">
                        🚀 Access HRMS Portal
                    </a>
                </div>

                <div class="security-notice">
                    <h4>⚠️ Security Notice</h4>
                    <p>For your security, please change your password immediately after your first login. Do not share your credentials with anyone.</p>
                </div>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                    <h4 style="margin: 0 0 15px 0; color: #495057;">💡 What you can do in HRMS:</h4>
                    <ul style="margin: 0; color: #6c757d;">
                        <li>View and update your personal information</li>
                        <li>Apply for leave and track leave balance</li>
                        <li>View your attendance and timesheet</li>
                        <li>Access company announcements and policies</li>
                        <li>Update your emergency contacts</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p>If you have any questions or need assistance, please contact the HR department.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2024 HRMS Portal. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Generate a simple text version of the email
 * @param {string} userName - Generated username
 * @param {string} tempPassword - Temporary password
 * @param {string} employeeName - Full name of the employee
 * @param {string} resetToken - Password reset token (optional)
 * @returns {string} - Plain text email
 */
const generateNewEmployeeTextTemplate = (userName, tempPassword, employeeName, resetToken = null) => {
    const resetLink = resetToken 
        ? `${config.server.baseUrl || 'http://localhost:3000'}/reset-password?token=${resetToken}`
        : `${config.server.baseUrl || 'http://localhost:3000'}/login`;

    return `
Welcome to HRMS Portal, ${employeeName}!

Your account has been successfully created. Below are your login credentials:

Username: ${userName}
Temporary Password: ${tempPassword}

Next Steps:
1. Visit: ${resetLink}
2. Login using the credentials provided above
3. Change your password immediately for security
4. Complete your profile setup

Security Notice:
For your security, please change your password immediately after your first login. 
Do not share your credentials with anyone.

What you can do in HRMS:
- View and update your personal information
- Apply for leave and track leave balance
- View your attendance and timesheet
- Access company announcements and policies
- Update your emergency contacts

If you have any questions or need assistance, please contact the HR department.

Best regards,
HR Team
HRMS Portal
    `.trim();
};

module.exports = {
    generateNewEmployeeEmailTemplate,
    generateNewEmployeeTextTemplate
};
