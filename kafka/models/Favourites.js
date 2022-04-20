const mongoose = require("mongoose");

const FavouritesSchema = new mongoose.Schema({

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "items"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

});

const FavouritesModel = mongoose.model("favourites", FavouritesSchema);
module.exports = FavouritesModel;
