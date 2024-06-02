const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Transaction = require('../models/transaction'); // Replace with the actual path to your Transaction model

const seedTransactions = async (numTransactions = 10) => {
  try {
    await Transaction.deleteMany(); // Clear existing transactions
    const fakeTransactions = Array.from({ length: numTransactions }, createFakeTransaction);
    await Transaction.insertMany(fakeTransactions);
    console.log('Successfully seeded Transactions');
  } catch (error) {
    console.error('Error seeding transactions:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Function to create a fake transaction
const createFakeTransaction = () => {
  return {
    amount: faker.finance.amount(),
    paymentId: faker.datatype.uuid(),
    Gateway: faker.finance.transactionType(),
    category: faker.commerce.department(),
    date: faker.date.past(),
    paymentStatus: faker.datatype.boolean() // Generates true or false
  };
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  // Call seedTransactions function after successful connection
  seedTransactions(500); // Generate 10 transactions (you can change the number as per your requirement)
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
