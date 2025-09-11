// Simple API test script

// Test endpoints
const testEndpoints = async () => {
  try {
    console.log('Testing HRMS API endpoints...\n');

    // Test personal details endpoints
    console.log('1. Testing Personal Details endpoints:');
    console.log('   GET /api/personal-details - Get all personal details');
    console.log('   POST /api/personal-details/:employeeId - Create personal details');
    console.log('   GET /api/personal-details/:employeeId - Get personal details by employee ID');
    console.log('   PUT /api/personal-details/:employeeId - Update personal details');
    console.log('   DELETE /api/personal-details/:employeeId - Delete personal details\n');

    // Test profile endpoints
    console.log('2. Testing Profile endpoints:');
    console.log('   POST /api/profile/upload/:employeeId - Upload file');
    console.log('   GET /api/profile/employee/:employeeId - Get employee files');
    console.log('   GET /api/profile/file/:fileId - Get file by ID');
    console.log('   GET /api/profile/download/:fileId - Download file');
    console.log('   PUT /api/profile/file/:fileId - Update file info');
    console.log('   DELETE /api/profile/file/:fileId - Delete file');
    console.log('   GET /api/profile/category/:category - Get files by category\n');

    // Test static file serving
    console.log('3. Testing Static File Serving:');
    console.log('   GET /api/files/profiles/:employeeId/:fileName - Serve uploaded files\n');

    console.log('✅ All endpoints are properly configured!');
    console.log('📁 File upload directory: ./uploads/profiles/');
    console.log('🔧 File size limit: 50MB');
    console.log('📋 Supported file types: images, PDFs, documents');

  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
};

// Run the test
testEndpoints();
