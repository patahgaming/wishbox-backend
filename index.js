const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');

const userRoutes = require('./routes/userRoute');
const targetRoutes = require('./routes/targetRoute');
// const authRoutes = require('./routes/authRoutes'); // Tambahin juga kalau memang ada

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Supaya bisa membaca request body JSON

// Routes
app.use('/api/user', userRoutes);
app.use('/api/target', targetRoutes);
// app.use('/api/auth', authRoutes); // Jangan lupa tambahin kalau mau pakai auth

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'TYPO banggggggg' });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
