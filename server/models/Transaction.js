const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: String,
  description: String,
  entry: Number,
  exit: Number,
  amount: Number,
  category: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);