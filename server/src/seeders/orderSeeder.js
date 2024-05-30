const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Order = require('../models/order'); // Replace 'path/to/your/order/model' with the actual path to your Order model

const seedOrders = async (numOrders = 10) => {
  try {
    await Order.deleteMany(); // Clear existing orders
    const fakeOrders = Array.from({ length: numOrders }, createFakeOrder);
    await Order.insertMany(fakeOrders);
    console.log('Successfully seeded Orders');
  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Function to create a fake order
const createFakeOrder = () => {
  return {
    orderId: faker.datatype.uuid(),
    customerName: faker.internet.userName(),
    products: [{
      productId: faker.datatype.uuid(),
      quantity: faker.datatype.number({ min: 1, max: 10 })
    }],
    totalPrice: faker.datatype.number({ min: 10, max: 1000 }),
    orderDate: faker.date.past()
  };
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dashboard', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  // Call seedOrders function after successful connection
  seedOrders(50); // Generate 10 orders (you can change the number as per your requirement)
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
