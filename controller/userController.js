const { User_Model } = require("../model/userModel");
const { createTempPassword } = require("../utils/password");
const bcrypt = require('bcryptjs');
const { generateUsername } = require("../utils/username");
const { sendEmailGmail } = require("../utils/Email");
const { generateNewEmployeeEmailTemplate } = require("../htmltemplete/newEmployetemplate");
const { generateTokenPair, verifyToken } = require("../utils/jwt");
const config = require('../config');



module.exports = {
    async healthCheck(req, res) {
        res.status(config.statusCodes.success).json({ message: "Server is running", status: "OK" });
    },
    async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            // Validate required fields
            if (!email || !password) {
                return res.status(config.statusCodes.badRequest).json({
                    message: config.messages.error.validation,
                    error: 'Email and password are required'
                });
            }

            // Find user by email
            const user = await User_Model.findOne({
                $or: [{ email: email }, { userName: email }]
              }).populate('manager', 'employeeName');
            if (!user) {
                return res.status(config.statusCodes.unauthorized).json({
                    message: config.messages.error.invalidCredentials,
                    error: 'Invalid email or password'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(config.statusCodes.forbidden).json({
                    message: config.messages.error.unauthorized,
                    error: 'Account is deactivated'
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(config.statusCodes.unauthorized).json({
                    message: config.messages.error.invalidCredentials,
                    error: 'Invalid email or password'
                });
            }

            // Generate JWT tokens
            const tokens = generateTokenPair(user);

            // Update last login time
            await User_Model.findByIdAndUpdate(user._id, {
                lastLoginAt: new Date(),
            });

            res.status(config.statusCodes.success).json({
                message: config.messages.success.loginSuccess,
                user: {
                    id: user._id,
                    email: user.email,
                    userName: user.userName,
                    employeeName: user.employeeName,
                    employeeNumber: user.employeeNumber,
                    phone: user.phone,
                    position: user.position,
                    department: user.department,
                    manager: user.manager,
                    dateOfJoining: user.dateOfJoining,
                    role: user.role,
                    isTemPassword: user.isTemPassword,
                    isActive: user.isActive
                },
                ...tokens
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(config.statusCodes.serverError).json({
                message: config.messages.error.serverError,
                error: error.message
            });
        }
    },
    async logoutUser(req, res) {
        try {
            // In a more advanced implementation, you might want to:
            // 1. Add token to a blacklist
            // 2. Store logout time in database
            // 3. Invalidate refresh tokens

            res.status(config.statusCodes.success).json({
                message: config.messages.success.logoutSuccess
            });
        } catch (error) {
            console.error("Logout error:", error);
            res.status(config.statusCodes.serverError).json({
                message: config.messages.error.serverError,
                error: error.message
            });
        }
    },
    async refreshToken(req, res) {
        const { refreshToken } = req.body;

        try {
            if (!refreshToken) {
                return res.status(config.statusCodes.badRequest).json({
                    message: config.messages.error.tokenRequired,
                    error: 'Refresh token is required'
                });
            }

            // Verify refresh token
            const decoded = verifyToken(refreshToken);
            
            if (decoded.type !== 'refresh') {
                return res.status(config.statusCodes.unauthorized).json({
                    message: config.messages.error.invalidToken,
                    error: 'Invalid refresh token'
                });
            }

            // Find user
            const user = await User_Model.findById(decoded.id);
            if (!user || !user.isActive) {
                return res.status(config.statusCodes.unauthorized).json({
                    message: config.messages.error.userNotFound,
                    error: 'User not found or inactive'
                });
            }

            // Generate new token pair
            const tokens = generateTokenPair(user);

            res.status(config.statusCodes.success).json({
                message: config.messages.success.tokenRefreshed,
                ...tokens
            });

        } catch (error) {
            console.error("Token refresh error:", error);
            res.status(config.statusCodes.unauthorized).json({
                message: config.messages.error.invalidToken,
                error: error.message
            });
        }
    },
    async createUser(req, res) {
        const { employeeName, employeeNumber, dateOfJoining, email, phone, position, role, department, manager,branch } = req.body;
            const resetLink = `${req.headers['x-frontend-base-url']}/login`;
        console.log(req.user, "req.user", req.body);
        // For now, use a default createdBy since we don't have authentication yet
        const createdBy = req.user.id; 
        // const password = createTempPassword();
        const password = "temp@1234";
        const userName = generateUsername(employeeName,employeeNumber);
        // Generate professional HTML email template
        const htmlEmailContent = generateNewEmployeeEmailTemplate(email, password, employeeName,resetLink);
        console.log(htmlEmailContent,email, "htmlEmailContent","email");
        const emailResponse = await sendEmailGmail(email, htmlEmailContent, "Welcome to HRMS Portal - Your Login Credentials");
        console.log(emailResponse);
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        

        try {
            if (!employeeName || !employeeNumber || !dateOfJoining || !email || !phone || !position || !role || !department || !manager) {
                return res.status(400).json({ message: "All fields are required including department and manager" });
            }
            
            const user = await User_Model.create({ 
                userName,
                employeeName, 
                employeeNumber, 
                dateOfJoining, 
                email, 
                phone, 
                position, 
                role,
                department: department || "General",
                manager: manager || "Not Assigned",
                password: hashedPassword,
                createdBy,
                branch,
                updatedBy: createdBy,
                deletedBy: createdBy
            });
                
            res.status(200).json({ 
                message: "Employee created successfully", 
                user: {
                    id: user._id,
                    employeeName: user.employeeName,
                    employeeNumber: user.employeeNumber,
                    email: user.email,
                    position: user.position,
                    role: user.role
                }
            });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(203).json({ message: "Internal server error", error: error.message });
        }
    },
    async updateUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User_Model.findByIdAndUpdate(id, { ...req.body });
            res.status(200).json({ message: "User updated successfully", user: user });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },
    async updateUserPassword(req, res) {
        const { email, oldPassword, newPassword } = req.body;
        try {
            if (!email || !oldPassword || !newPassword) {
                return res.status(400).json({ 
                    message: "Email, old password, and new password are required" 
                });
            }
            const user = await User_Model.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ 
                    message: "User not found with this email address" 
                });
            }
            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return res.status(400).json({ 
                    message: "Old password is incorrect" 
                });
            }
            

            // Check if new password is different from old password
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({ 
                    message: "New password must be different from the old password" 
                });
            }

            // Hash new password
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update user password
            const updatedUser = await User_Model.findByIdAndUpdate(
                user._id,
                { 
                    password: hashedNewPassword,
                    isTemPassword: false, // Mark as not temporary password
                    updatedAt: new Date(),
                    updatedBy: user._id // Self-updated
                },
                { new: true }
            );
            // Send confirmation email
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Password Updated Successfully</h2>
                    <p>Hello ${user.employeeName},</p>
                    <p>Your password has been successfully updated for your HRMS account.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Account Details:</strong></p>
                        <p>Email: ${user.email}</p>
                        <p>Username: ${user.userName}</p>
                        <p>Updated: ${new Date().toLocaleString()}</p>
                    </div>
                    <p>If you did not make this change, please contact the HR department immediately.</p>
                    <p>Best regards,<br>HR Team</p>
                </div>
            `;

            try {
                await sendEmailGmail(email, emailContent, "Password Updated - HRMS Account");
            } catch (emailError) {
                console.log("Password update email failed:", emailError);
                // Don't fail the password update if email fails
            }

            res.status(200).json({ 
                message: "Password updated successfully",
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    userName: updatedUser.userName,
                    isTemPassword: updatedUser.isTemPassword
                }
            });

        } catch (error) {
            console.error("Error updating password:", error);
            res.status(500).json({ 
                message: "Internal server error", 
                error: error.message 
            });
        }
    },
    async getAllUsers(req, res) {
        try {
            const users = await User_Model.aggregate([
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'managerData'
                    }
                },
                {
                    $lookup: {
                        from: 'PersonalDetails',
                        localField: '_id',
                        foreignField: 'employeeId',
                        as: 'personalDetails'
                    }
                },
                {
                    $addFields: {
                        manager: {
                            $cond: {
                                if: { $gt: [{ $size: '$managerData' }, 0] },
                                then: { $arrayElemAt: ['$managerData.employeeName', 0] },
                                else: null
                            }
                        },
                        managerId: {
                            $cond: {
                                if: { $gt: [{ $size: '$managerData' }, 0] },
                                then: { $arrayElemAt: ['$managerData._id', 0] },
                                else: null
                            }
                        },
                        dateOfBirth: {
                            $cond: {
                                if: { $gt: [{ $size: '$personalDetails' }, 0] },
                                then: { $arrayElemAt: ['$personalDetails.dateOfBirth', 0] },
                                else: null
                            }
                        }
                    }
                },
                {
                    $project: {
                        managerData: 0,
                        personalDetails: 0
                    }
                }
            ]);

            res.status(200).json({
                message: "Users fetched successfully",
                users: users
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User_Model.findById(id).populate('manager', 'employeeName');
            res.status(200).json({
                message: "User fetched successfully",
                user: user
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    async getManagers(req, res) {
        try {
            const managers = await User_Model.find({ role: { $in: ['manager', 'admin', 'super_admin'] }, isActive: true }, 'employeeName _id');
            res.status(200).json({
                message: "Managers fetched successfully",
                managers: managers
            });
        } catch (error) {
            console.error("Error fetching managers:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}
