const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const propertyRoutes = require('./routes/propertyRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Admin Login Route (Hardcoded for single user)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // In a real app, use environment variables and hashing
  if (username === 'Kirit' && password === 'Kirit123') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Routes
app.use('/api/properties', propertyRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
