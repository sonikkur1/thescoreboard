const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  description: { type: String, required: true },
  entry: { type: Number, required: true },
  exit: { type: Number, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);