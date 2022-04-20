const mongoose = require("mongoose");
const UserModel = require("../models/Users");
const ItemsModel = require("../models/Items");
const FavouritesModel = require("../models/Favourites");
const CartModel = require("../models/Cart");

async function handle_request(req, callback) {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const newUser = new UserModel({
            name: username, email: email, password: password,
            fullAddress: null, city: null, phoneNumber: null, dob: null, gender: null, profilePic: null,
            about: null, shopName: null, shopImage: null
        });
        await newUser.save({}, (err, result) => {
            if (err) {
              console.log("err", err);
              //res.json(err);
              callback(null, { status_code: 500, response: { msg: err} });
        return;
            } else {
              console.log(result);
              //res.send({ success: true, result });
              callback(null, {status_code: 200, response: {msg: "Customer Signup Successful", success: true, result: result} })

              return;
            }
          })
}



exports.handle_request = handle_request;