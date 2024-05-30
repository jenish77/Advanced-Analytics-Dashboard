const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    minlength: 6
  },
  city: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
