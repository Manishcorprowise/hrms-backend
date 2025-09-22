

const path = require('path');
const fs = require('fs');
const { Document_Model } = require('../model/documentModel');
const config = require('../config');

// Helper function to get the correct base URL for file serving
function getFileBaseUrl(req) {
  // Check if we have a custom base URL in config
  if (config.fileUpload.baseUrl) {
    return config.fileUpload.baseUrl.endsWith('/') 
      ? config.fileUpload.baseUrl 
      : config.fileUpload.baseUrl + '/';
  }
  
  // For production, try to get the proper protocol and host
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  
  // Remove port from host if it's a standard port
  let cleanHost = host;
  if ((protocol === 'https' && host.includes(':443')) || 
      (protocol === 'http' && host.includes(':80'))) {
    cleanHost = host.split(':')[0];
  }
  
  return `${protocol}://${cleanHost}/api/files/`;
}

// Controller to handle file upload and save document info
async function uploadDocumentFile(req, res) {
    try {
        const { employeeId, category, files } = req.body;

        if (!employeeId || !category || !files || !Array.isArray(files)) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields: employeeId, category, and files array'
            });
        }

        const uploadedDocuments = [];
        const validDocumentTypes = ['aadhaar', 'profile', 'identity', 'address', 'education', 'experience', 'other'];

        // Validate document category
        if (!validDocumentTypes.includes(category)) {
            return res.status(400).json({
                status: false,
                message: `Invalid document category. Must be one of: ${validDocumentTypes.join(', ')}`
            });
        }

        // Create uploads/documents/<employeeId>/<category>/ folder if not exists
        const filesFolder = path.join(
            __dirname,
            "..",
            "uploads",
            "documents",
            employeeId.toString(),
            category
        );
        if (!fs.existsSync(filesFolder)) {
            fs.mkdirSync(filesFolder, { recursive: true });
        }

        // Process each file in the files array
        for (const fileData of files) {
            const { originalName, fileType, fileSize, dataUrl } = fileData;

            if (!originalName || !fileType || !dataUrl) {
                continue; // Skip invalid file data
            }

            // Prepare file name and path
            let fileExt = originalName.split(".");
            fileExt = fileExt[fileExt.length - 1];
            const timestamp = Date.now();
            const savedFileName = `${category}-${timestamp}-${Math.floor(Math.random() * 1000000000)}.${fileExt}`;
            const filePath = path.join(filesFolder, savedFileName);

            // Extract base64 data from dataUrl
            const base64File = dataUrl.replace(/^data:.*;base64,/, "");

            // Write file to disk
            fs.writeFileSync(filePath, base64File, { encoding: "base64" });

            // Save document info to DB
            const document = new Document_Model({
                employeeId,
                fileName: savedFileName,
                originalName: originalName,
                fileType: category,
                filePath: path.relative(path.join(__dirname, "..", "uploads"), filePath),
                fileSize: fileSize || 0,
                mimeType: fileType,
                uploadedBy: req.user && req.user.id ? req.user.id : null,
            });

            await document.save();
            uploadedDocuments.push(document);
        }

        return res.status(201).json({
            status: true,
            message: 'Files uploaded successfully',
            data: uploadedDocuments
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Controller to get files for an employee
async function getDocumentFiles(req, res) {
  try {
    const { employeeId, category } = req.query;
    
    if (!employeeId) {
      return res.status(400).json({
        status: false,
        message: "Missing employeeId"
      });
    }

    // Build query filter
    const filter = { employeeId };
    
    // If category is specified, filter by it
    if (category) {
      const validCategories = ['aadhaar', 'profile', 'identity', 'address', 'education', 'experience', 'other'];
      if (validCategories.includes(category)) {
        filter.fileType = category;
      } else {
        return res.status(400).json({
          status: false,
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        });
      }
    }

    // Fetch documents based on filter
    const docs = await Document_Model.find(filter)
      .sort({ createdAt: -1 });

    // Debug logging
    console.log('Query filter:', filter);
    console.log('Found documents:', docs.length);
    console.log('Documents:', docs);

    // If category is specified, return files directly
    if (category) {
      const filesWithUrl = docs.map(doc => ({
        ...doc.toObject(),
        fileUrl: doc.filePath.replace(/\\/g, "/")
      }));

      return res.status(200).json({
        status: true,
        data: {
          category: category,
          files: filesWithUrl,
          count: filesWithUrl.length
        }
      });
    }

    // Group documents by fileType for all categories
    const grouped = {};
    
    docs.forEach((doc) => {
      const type = doc.fileType || "other";
      if (!grouped[type]) {
        grouped[type] = {
          category: type,
          files: [],
          count: 0
        };
      }
      grouped[type].files.push({
        ...doc.toObject(),
        fileUrl: doc.filePath.replace(/\\/g, "/")
      });
      grouped[type].count++;
    });

    return res.status(200).json({
      status: true,
      data: {
        employeeId: employeeId,
        categories: grouped,
        totalFiles: docs.length
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
}

module.exports = {
    uploadDocumentFile,
    getDocumentFiles
};
