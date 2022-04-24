const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "items"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  orderId: {
    type: String
  },
  qty: {
    type: Number
  },
  purchase: {
    type: Number
  },
  gift:{
    type: String
  }
}, {
  timestamps: true}

);

const CartModel = mongoose.model("cartitems", CartSchema);
module.exports = CartModel;
