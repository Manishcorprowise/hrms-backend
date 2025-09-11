const { User_Model } = require('./model/userModel');
const bcrypt = require('bcryptjs');
const { generateUsername } = require('./utils/username');
const { connectDatabase } = require('./dbConfig/db');

async function createTestUser() {
    try {
        // Connect to database first
        await connectDatabase();
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection failed:', error);
        return;
    }
    try {
        // Check if test user already exists
        const existingUser = await User_Model.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists, updating password...');
            // Update the password to ensure it's correct
            const password = 'test123';
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            await User_Model.findByIdAndUpdate(existingUser._id, {
                password: hashedPassword,
                isTemPassword: false,
                isActive: true
            });
            
            console.log('Test user password updated');
            console.log('Email: test@example.com');
            console.log('Password: test123');
            return;
        }

        const password = 'test123';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userName = generateUsername('Test User', 'EMP001');

        const user = await User_Model.create({
            userName,
            employeeName: 'Test User',
            employeeNumber: 'EMP001',
            dateOfJoining: new Date('2024-01-01'),
            email: 'test@example.com',
            phone: '1234567890',
            position: 'Software Developer',
            department: 'IT',
            manager: 'John Doe',
            role: 'employee',
            password: hashedPassword,
            isTemPassword: false,
            isActive: true,
            createdBy: 'admin',
            updatedBy: 'admin',
            deletedBy: 'admin'
        });

        console.log('Test user created successfully:');
        console.log('Email: test@example.com');
        console.log('Password: test123');
        console.log('User ID:', user._id);
    } catch (error) {
        console.error('Error creating test user:', error);
    }
}

createTestUser();