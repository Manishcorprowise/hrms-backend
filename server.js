const express = require('express');
const { connectDatabase } = require('./dbConfig/db');
const { userRoutes } = require('./routes/userRoutes');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/employee', userRoutes);
app.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${port}`);
});