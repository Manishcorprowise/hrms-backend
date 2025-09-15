

const path = require('path');
const fs = require('fs');
const { Document_Model } = require('../model/documentModel');

// Controller to handle file upload and save document info
async function uploadDocumentFile(req, res) {
    try {
        const { file, fileName, employeeId, fileType } = req.body;

        if (!file || !fileName || !employeeId || !fileType) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields: file, fileName, employeeId'
            });
        }

        // Create uploads/<fileType>/<employeeId> folder if not exists
        const filesFolder = path.join(
            __dirname,
            "..",
            "uploads",
            fileType,
            employeeId.toString()
        );
        if (!fs.existsSync(filesFolder)) {
            fs.mkdirSync(filesFolder, { recursive: true });
        }

        // Prepare file name and path
        let fileExt = fileName.split(".");
        fileExt = fileExt[fileExt.length - 1];
        const timestamp = Date.now();
        const savedFileName = `${fileName.split(".")[0]}_${timestamp}.${fileExt}`;
        const filePath = path.join(filesFolder, savedFileName);

        // Remove base64 prefix if present
        const base64File = file.replace(/^data:.*;base64,/, "");
        fs.writeFileSync(filePath, base64File, { encoding: "base64" });

        // Save document info to DB
        const document = new Document_Model({
            employeeId,
            fileName: savedFileName,
            originalName: fileName,
            fileType,
            filePath: path.relative(path.join(__dirname, "..", "uploads"), filePath), // relative path from uploads
            uploadedBy: req.user && req.user.id ? req.user.id : null,
        });

        await document.save();

        return res.status(201).json({
            status: true,
            message: 'File uploaded successfully',
            data: document
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Optionally, a controller to get files for an employee
async function getDocumentFiles(req, res) {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({
        status: false,
        message: "Missing employeeId"
      });
    }

    // Fetch all documents for the given employeeId that are not deleted
    const docs = await Document_Model.find({ employeeId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .select(
        "fileName originalName filePath fileSize mimeType fileType category description createdAt updatedAt"
      );

    // Group documents by fileType
    const grouped = {};
    const baseUrl = `${req.protocol}://${req.get("host")}/api/files/`;
    docs.forEach((doc) => {
      const type = doc.fileType || "other";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push({
        ...doc.toObject(),
        fileUrl: baseUrl + doc.filePath.replace(/\\/g, "/")
      });
    });

    return res.status(200).json({
      status: true,
      data: grouped
    });
  } catch (error) {
    console.error("Error fetching documents:", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
}

module.exports = {
    uploadDocumentFile,
    getDocumentFiles
};
