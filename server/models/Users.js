const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  about: {
    type: String,
  },

  shopName: {
    type: String,
  },
  shopImage: {
    type: String,
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
