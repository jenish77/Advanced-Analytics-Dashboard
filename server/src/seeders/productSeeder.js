const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('../models/product');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Function to create a fake user
const createFakeProduct = () => {
  return {
    name: faker.commerce.product() ,
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    createdAt: faker.date.past()
  };
};

// Seed the database with fake users
const seedUsers = async (numUsers = 10) => {
  try {
    await Product.deleteMany(); // Clear existing users
    const fakeProduct = Array.from({ length: numUsers }, createFakeProduct);
    await Product.insertMany(fakeProduct);
    console.log('Successfully seeded Products');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder script
seedUsers(50); // Change this number to create more or fewer users