// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const transactionsRouter = require('./routes/transactions');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://tradingboard.netlify.app/', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRouter);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
