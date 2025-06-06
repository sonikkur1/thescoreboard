const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  description: String,
  category: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);