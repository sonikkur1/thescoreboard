const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  description: String,
  category: String,
  user: String,
}, { timestamps: true }); // ⬅️ This adds `createdAt` automatically

module.exports = mongoose.model('Transaction', transactionSchema);
