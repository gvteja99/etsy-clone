const mongoose = require("mongoose");

const ItemsSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  itemName: {
    type: String,
    required: true,
  },
  itemCategory: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  itemCount: {
    type: Number,
    required: true,
  },
  itemImage: {
    type: String,
  },
});

const ItemsModel = mongoose.model("items", ItemsSchema);
module.exports = ItemsModel;
