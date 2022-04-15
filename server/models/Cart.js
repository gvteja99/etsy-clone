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
  qty: {
    type: Number
  },
  // purchase: {
  //   type: Number
  // }
});

const CartModel = mongoose.model("cart", CartSchema);
module.exports = CartModel;
