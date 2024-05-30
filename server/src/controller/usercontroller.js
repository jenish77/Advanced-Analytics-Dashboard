const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const Transaction = require("../models/transaction");
const PaymentLink = require("../models/paymentlink");
const crypto = require("crypto");

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getorders(req, res) {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error);
  }
}


async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function generatePaymentLink(req, res) {
  try {
    const { orderId, amount } = req.body;
    const order = await Order.find({ orderId: orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const token = crypto.randomBytes(16).toString("hex");
    let paymenLink = new PaymentLink({
      token,
      orderId,
      amount,
    });
    await paymenLink.save();
  
    const paymentLinkUrl = `https://example.com/pay?token=${token}`;
    res.json({ paymentLink: paymentLinkUrl });
  } catch (error) {
    console.error("Error:", error);
  }

}

async function completePayment(req, res) {
  try {
    const { token } = req.body;
    const paymentLink = await PaymentLink.findOne({ token });
    if (!paymentLink || paymentLink.used || paymentLink.validUntil < new Date()) {
      return res.status(404).json({ error: 'Invalid or expired payment link' });
    }
    const paymentSuccess = true;

  if (paymentSuccess) {
    // Mark payment link as used
    paymentLink.used = true;
    await paymentLink.save();

    // Update order status
    await Order.updateOne({ orderId: paymentLink.orderId }, { status: 'Paid' });

    res.json({ message: 'Payment completed successfully' });
  } else {
    res.status(500).json({ error: 'Payment processing failed' });
  }
  } catch (error) {
    console.error("Error:", error);
  }
}


module.exports = {
  getUsers,
  getorders,
  getProducts,
  getTransactions,
  generatePaymentLink,
  completePayment
};
