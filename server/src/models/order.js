const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
    },
    customerName: {
        type: String,
    },
    products: [{
        productId: {
            type: String,
        },
        quantity: {
            type: Number,
        }
    }],
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;