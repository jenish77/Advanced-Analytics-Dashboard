const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
    },
    paymentId: {
        type: String,
    },
    Gateway:{   
        type: String,
    },
    category: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
