const { default: mongoose } = require("mongoose");
const { Type_Model, OptionType_Model } = require("../model/masterModel");
const { Request_Model } = require("../model/requestModel");
const { User_Model } = require("../model/userModel");
const fs = require('fs');
const path = require('path');


module.exports = {
    async createRequest(req, res) {
        try {
            const { requestTypeCode, description, from, to, file, fileName } = req.body;
            console.log("Request Body:", req.body);

            // filePath will added later when we implement file upload
            // If a file is provided, generate a unique file path for this request
            let filePath = undefined;
            if (file && fileName) {
                // Create a unique folder for each request using userId and timestamp
                const timestamp = Date.now();
                const userFolder = req.user.id.toString();
                // Store in database as: requests/${userFolder}/${timestamp}_${fileName}
                filePath = `requests/${userFolder}/${timestamp}_${fileName}`;
            }

            // If a file is provided in base64, decode and save it to the generated filePath
            if (file && fileName && filePath) {
                // Actual file location on disk: uploads/requests/${userFolder}/${timestamp}_${fileName}
                const actualFilePath = `uploads/${filePath}`;

                // Ensure the directory exists
                const dir = path.dirname(actualFilePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // file is expected to be a base64 string (may include data:...;base64, prefix)
                let base64Data = file;
                // Remove data URL prefix if present
                if (base64Data.startsWith('data:')) {
                    base64Data = base64Data.split(',')[1];
                }

                // Write the file to disk using actual file path
                fs.writeFileSync(actualFilePath, base64Data, 'base64');
            }

            //createdBy will be added from the token
            const employeeId = new mongoose.Types.ObjectId(req.user.id)
            const createdBy = new mongoose.Types.ObjectId(req.user.id);


            const savedRequest = await Request_Model.create({
                employeeId: new mongoose.Types.ObjectId(employeeId),
                requestTypeCode,
                description,
                from,
                to,
                fileName,
                filePath,
                createdBy
            });
            return res.status(200).json({
                status: true,
                message: "Request added successfully",
                data: savedRequest
            });
        } catch (error) {
            console.error("Error adding request:", error.message);
            return res
                .status(203)
                .json({ status: false, message: "Internal Server Error" });
        }
    },
    async getRequest(req, res) {
        try {
            const employeeId = req.user.id; // Assuming employeeId is passed as a query parameter
            // Logic to get type name fron the option database

            const requests = await Request_Model.aggregate([
                {
                    $match: {
                        employeeId: new mongoose.Types.ObjectId(employeeId),
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: "OptionTypes", // 👈 name of the other collection (check actual collection name)
                        localField: "requestTypeCode", // field in Request_Model
                        foreignField: "code", // field in OptionType_Model (assuming code matches requestTypeCode)
                        as: "requestTypeDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$requestTypeDetails",
                        preserveNullAndEmptyArrays: true // keep even if no match
                    }
                },
                {
                    $project: {
                        employeeId: 1,
                        status: 1,
                        description: 1,
                        from: 1,
                        to: 1,
                        fileName: 1,
                        filePath: 1,
                        createdBy: 1,
                        createdAt: 1,
                        reply: 1,
                        requestTypeCode: 1,
                        requestTypeName: "$requestTypeDetails.name" // 👈 only take the name field
                    }
                }
            ]);
            return res.status(200).json({
                status: true,
                message: "Request fetched successfully",
                data: requests
            });

        } catch (error) {
            console.error('Error in get Request:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },
    // Get requests for manager (requests raised by employees whose manager is current user)
    async getRequestsForManager(req, res) {
        try {
            const managerId = new mongoose.Types.ObjectId(req.user.id);
            const userRole = req.user.role;

            // If user is admin, get all requests
            if (userRole === 'admin') {
                const allRequests = await Request_Model.aggregate([
                    // join with Users to get employee details
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'employeeId',
                            foreignField: '_id',
                            as: 'employeeDetails'
                        }
                    },
                    { $unwind: { path: '$employeeDetails', preserveNullAndEmptyArrays: true } },
                    { $match: { isDeleted: false } },
                    {
                        $lookup: {
                            from: 'OptionTypes',
                            localField: 'requestTypeCode',
                            foreignField: 'code',
                            as: 'requestTypeDetails'
                        }
                    },
                    { $unwind: { path: '$requestTypeDetails', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            employeeId: 1,
                            status: 1,
                            description: 1,
                            from: 1,
                            to: 1,
                            fileName: 1,
                            createdBy: 1,
                            createdAt: 1,
                            requestTypeCode: 1,
                            filePath: 1,
                            reply: 1,
                            employeeName: '$employeeDetails.employeeName',
                            employeeEmail: '$employeeDetails.email',
                            requestTypeName: '$requestTypeDetails.name'
                        }
                    }
                ]);

                return res.status(200).json({ 
                    status: true, 
                    message: 'All requests fetched for admin', 
                    data: allRequests,
                    count: allRequests.length
                });
            }

            // For managers, get requests from their direct reports
            const requests = await Request_Model.aggregate([
                // join with Users to get employee details
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'employeeId',
                        foreignField: '_id',
                        as: 'employeeDetails'
                    }
                },
                { $unwind: { path: '$employeeDetails', preserveNullAndEmptyArrays: true } },
                // filter by manager - only include requests where employee has this manager
                { 
                    $match: { 
                        'employeeDetails.manager': managerId, 
                        isDeleted: false,
                        'employeeDetails.manager': { $exists: true, $ne: null }
                    } 
                },
                // lookup option type name
                {
                    $lookup: {
                        from: 'OptionTypes',
                        localField: 'requestTypeCode',
                        foreignField: 'code',
                        as: 'requestTypeDetails'
                    }
                },
                { $unwind: { path: '$requestTypeDetails', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        employeeId: 1,
                        status: 1,
                        description: 1,
                        from: 1,
                        to: 1,
                        fileName: 1,
                        filePath: 1,
                        createdBy: 1,
                        createdAt: 1,
                        requestTypeCode: 1,
                        reply: 1,
                        employeeName: '$employeeDetails.employeeName',
                        employeeEmail: '$employeeDetails.email',
                        requestTypeName: '$requestTypeDetails.name'
                    }
                }
            ]);

            return res.status(200).json({ 
                status: true, 
                message: 'Requests fetched for manager', 
                data: requests,
                count: requests.length
            });
        } catch (error) {
            console.error('Error in getRequestsForManager:', error);
            return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },
    // Manager or admin can respond to a request (approve/reject and add a reply)
    async respondRequest(req, res) {
        try {
            const { id, status, reply } = req.body; // status: approved | rejected | pending
            if (!id) return res.status(400).json({ status: false, message: 'Request id is required' });

            const request = await Request_Model.findById(id);
            if (!request) return res.status(404).json({ status: false, message: 'Request not found' });

            // Check permission: if manager, ensure the request belongs to one of their reports
            const actingUserRole = req.user.role;
            if (actingUserRole === 'manager') {
                const employee = await User_Model.findById(request.employeeId).select('manager');
                if (!employee) return res.status(404).json({ status: false, message: 'Employee not found' });
                if (!employee.manager || employee.manager.toString() !== req.user.id.toString()) {
                    return res.status(403).json({ status: false, message: 'Not authorized to act on this request' });
                }
            }

            request.status = status || request.status;
            if (typeof reply !== 'undefined') request.reply = reply;
            request.updatedBy = new mongoose.Types.ObjectId(req.user.id);
            request.updatedAt = new Date();

            const saved = await request.save();

            return res.status(200).json({ status: true, message: 'Request updated', data: saved });
        } catch (error) {
            console.error('Error in respondRequest:', error);
            return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },
    async updateRequest(req, res) {
        try {
            const { id, description, from, to, file, fileName } = req.body;
            if (!id) {
                return res.status(203).json({ status: false, message: 'Request id is required' });
            }
            const request = await Request_Model.findById(id);
            if (!request) return res.status(404).json({ status: false, message: 'Request not found' });
            // Only the creator can update and only when status is pending
            if (request.employeeId.toString() !== req.user.id.toString()) {
                return res.status(403).json({ status: false, message: 'Not authorized to update this request' });
            }
            // Handle file upload if file is provided
            let filePath = request.filePath; // Keep existing file path if no new file
            if (file && fileName) {
                // Create a unique folder for each request using userId and timestamp
                const timestamp = Date.now();
                const userFolder = req.user.id.toString();
                // Store in database as: requests/${userFolder}/${timestamp}_${fileName}
                filePath = `requests/${userFolder}/${timestamp}_${fileName}`;
                
                // Actual file location on disk: uploads/requests/${userFolder}/${timestamp}_${fileName}
                const actualFilePath = `uploads/${filePath}`;
                const dir = path.dirname(actualFilePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // file is expected to be a base64 string (may include data:...;base64, prefix)
                let base64Data = file;
                // Remove data URL prefix if present
                if (base64Data.startsWith('data:')) {
                    base64Data = base64Data.split(',')[1];
                }

                // Write the file to disk using actual file path
                fs.writeFileSync(actualFilePath, base64Data, 'base64');
            }

            request.description = description || request.description;
            request.from = from || request.from;
            request.to = to || request.to;
            request.fileName = fileName || request.fileName;
            request.filePath = filePath;
            request.updatedBy = new mongoose.Types.ObjectId(req.user.id);
            request.updatedAt = new Date();

            const saved = await request.save();
            return res.status(200).json({ status: true, message: 'Request updated successfully', data: saved });
        } catch (error) {
            console.error('Error in updateRequest:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },
    async deleteRequest(req, res) {
        try {
            // Soft-delete a request (only creator or admin)
            const { id } = req.body;
            if (!id) return res.status(400).json({ status: false, message: 'Request id is required' });

            const request = await Request_Model.findById(id);
            if (!request) return res.status(404).json({ status: false, message: 'Request not found' });

            // Only creator or admin can delete
            if (request.employeeId.toString() !== req.user.id.toString() && !['admin', 'super_admin'].includes(req.user.role)) {
                return res.status(403).json({ status: false, message: 'Not authorized to delete this request' });
            }

            request.isDeleted = true;
            request.deletedAt = new Date();
            request.deletedBy = req.user.id;
            await request.save();

            return res.status(200).json({ status: true, message: 'Request deleted successfully', data: request });
        } catch (error) {
            console.error('Error in deleteType:', error);
            return res.status(203).json({ status: false, message: 'Internal Server Error' });
        }
    },
}