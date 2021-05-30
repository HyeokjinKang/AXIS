const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true},
  salt: { type: String, required: true},
  hash: { type: String, required: true},
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);