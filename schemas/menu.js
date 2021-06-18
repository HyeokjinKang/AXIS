const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  store: { type: String, required: true },
  menu: { type: String, required: true },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  category: { type: String, required: true },
});

module.exports = mongoose.model("Menu", menuSchema);
