const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  const { user, description, entry, exit, amount, category } = req.body;

  if (
    typeof user !== 'string' ||
    typeof description !== 'string' ||
    typeof category !== 'string' ||
    isNaN(entry) ||
    isNaN(exit) ||
    isNaN(amount)
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const newTransaction = new Transaction({
      user,
      description,
      entry: parseFloat(entry),
      exit: parseFloat(exit),
      amount: parseFloat(amount),
      category,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// DELETE a transaction by ID
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;