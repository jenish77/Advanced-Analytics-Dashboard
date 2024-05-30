const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/user');

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
const createFakeUser = () => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(6),
    city: faker.address.city(),
    createdAt: faker.date.past()
  };
};

// Seed the database with fake users
const seedUsers = async (numUsers = 10) => {
  try {
    await User.deleteMany(); // Clear existing users
    const fakeUsers = Array.from({ length: numUsers }, createFakeUser);
    await User.insertMany(fakeUsers);
    console.log('Successfully seeded users');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder script
seedUsers(50); // Change this number to create more or fewer users
