const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      enum: ['Kevin', 'Addison'],
    },
    description: {
      type: String,
      required: true,
    },
    entry: {
      type: Number,
      required: true,
    },
    exit: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    returnAmount: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      enum: ['win', 'loss'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Paper', 'Fiat'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);