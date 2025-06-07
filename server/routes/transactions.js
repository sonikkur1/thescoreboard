const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user, description, entry, exit, amount, category } = req.body;

    if (
      !user || !description || entry == null || exit == null || amount == null || !category
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const entryNum = parseFloat(entry);
    const exitNum = parseFloat(exit);
    const amountNum = parseFloat(amount);
    const returnAmount = ((exitNum - entryNum) / entryNum) * amountNum;
    const percentage = ((exitNum - entryNum) / entryNum) * 100;
    const result = returnAmount >= 0 ? 'win' : 'loss';

    const newTransaction = new Transaction({
      user,
      description,
      entry: entryNum,
      exit: exitNum,
      amount: amountNum,
      returnAmount,
      percentage,
      result,
      category,
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;