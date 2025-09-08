const { User_Model } = require("../model/userModel");



module.exports = {
    async healthCheck(req, res) {
        res.status(200).json({ message: "Server is running", status: "OK" });
    },

    async createUser(req, res) {
        const { employeeName, employeeNumber, dateOfJoining, email, phone, position, role } = req.body;
        console.log(req.body);
        // For now, use a default createdBy since we don't have authentication yet
        const createdBy = "admin";
        const password = "123456";
        
        try {
            if (!employeeName || !employeeNumber || !dateOfJoining || !email || !phone || !position || !role ) {
                return res.status(400).json({ message: "All fields are required" });
            }
            
            const user = await User_Model.create({ 
                employeeName, 
                employeeNumber, 
                dateOfJoining, 
                email, 
                phone, 
                position, 
                role, 
                password,
                createdBy,
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
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

}