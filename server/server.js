import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scoreboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add new transaction
app.post('/api/transactions', async (req, res) => {
  const {
    user,
    description,
    entry,
    exit,
    amount,
    category,
    returnAmount,
    percentage,
    result,
  } = req.body;

  if (
    user === undefined ||
    description === undefined ||
    entry === undefined ||
    exit === undefined ||
    amount === undefined ||
    category === undefined ||
    returnAmount === undefined ||
    percentage === undefined ||
    result === undefined
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newTx = new Transaction({
      user,
      description,
      entry,
      exit,
      amount,
      returnAmount,
      percentage,
      result,
      category,
    });

    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});