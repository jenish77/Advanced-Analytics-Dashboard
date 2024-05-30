const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PaymentLinkSchema = new mongoose.Schema({
  token: { type: String, default: uuidv4 },
  orderId: String,
  amount: Number,
  validUntil: { type: Date, default: () => new Date(+new Date() + 2*60*60*1000) }, // 2 hours validity
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model('PaymentLink', PaymentLinkSchema);