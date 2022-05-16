// const kafka = require("./kafka/client.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = express("cocookie-parser");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const ItemsModel = require("./models/Items");
const FavouritesModel = require("./models/Favourites");
const CartModel = require("./models/Cart");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const passport = require('passport');
// const usepassport = require('./passport.js');
// const { checkAuth } = require("../utils/passport");
// const { checkAuth } = require('./passport');


const { query } = require("./graphql/queries");
const { mutation } = require("./graphql/mutations");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLInputObjectType,
} = require("graphql");


const auth = require('./passport');
const { hashSync, compareSync } = require('bcrypt');
const app = express();



app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser);
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));


app.use(express.json());

const { graphqlHTTP } = require("express-graphql");
const schema = new GraphQLSchema({
  query: query,
  mutation: mutation,
});
// app.listen(3003, () => console.log("server running"));
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.use(
  session({
    key: "email",
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    // duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
    cookie: {
      expiresIn: 60 * 60 * 24,
    },
  })
);


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

mongoose.connect(
  "mongodb+srv://etsy_user:etsy_password@etsycluster.yz62f.mongodb.net/etsy_database?retryWrites=true&w=majority",
  { useNewUrlParser: true, }
);




  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../client/public/Images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  //shop storage
  const shopStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../client/public/Images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../client/public/Users/Images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: "1000000" },
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const mimType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));
  
      if (mimType && extname) {
        return cb(null, true);
      }
      cb("Give proper file name");
    },
  }).single("itemImage");


app.use("/Images", express.static("./Images"));

app.post("/register", async (req, res) => {
  console.log("Register");
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  //const password = hashSync(req.body.password, 10);
  console.log(password)
  const newUser = new UserModel({
    name: username, email: email, password: password,
    fullAddress: null, city: null, phoneNumber: null, dob: null, gender: null, profilePic: null,
    about: null, shopName: null, shopImage: null
  });
  newUser.save({}, (err, result) => {
    if (err) {
      console.log("err", err);
      res.json(err);
    } else {
      console.log(result);
      res.send({ success: true, result });
    }
  }); });


app.get("/signin", (req, res) => {
  console.log("getsignin");
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});




app.post("/signin", (req, res) => {
  console.log("postsigin");
  const email = req.body.email;
  const password = req.body.password;
  console.log(email,password);
  UserModel.find({ email: email, password: password },
    (err, result) => {
      if (err) {
        console.log("sign in error");
        res.send({ err: err });
      }
      if (result.length > 0) {
        console.log("in this")
        res.cookie("user", result[0].name, {
          maxAge: 900000,
          httpOnly: false,
          path: "/",
        });

        const payload = { email: result.email};
            const token = jwt.sign(payload, "Randomstring", {
                expiresIn: "1d"
            });
        req.session.user = result;
        res.send({result: result, token: "jwt" + token});
        console.log("result");
      } else {
        console.log("invalid");
        res.send({ message: "Invalid creds" });
      }
    }
  );
});

app.get("/user", (req, res) => {
  console.log("hello" + req.session);
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/findShopDuplicates", (req, res) => {
  const shopName = req.body.shopName;
  console.log("In findShopDuplicates " + shopName);
  UserModel.find({ shopName: shopName },
    (err, result) => {
      console.log(result.length);
      if (result.length !== 0) {
        res.send({
          message: "duplicate",
        });
        console.log("In shops db shop name found");
      } else {
        res.send({
          message: "No duplicates",
        });
        console.log("In shops db and no shop name found");
      }
    }
  );
});

app.get("/getShopById/:userId", (req, res) => {
  console.log("In get shop by id");
  const userId = req.params.userId;
  UserModel.find({ _id: userId }, (err, result) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      console.log(result);
      res.send({ success: true, result: result });
    }
  });
});

app.post("/createShop/:id", (req, res) => {
  const shopName = req.body.shopName;
  const id = req.params.id;
  console.log(id)
  UserModel.findByIdAndUpdate(id, { shopName: shopName }, (err, result) => {
    if (err) {
      console.log("in createshop")
      console.log(err);
    } else {
      console.log(result);
      // res.send(result);
      res.send("Shops Value Inserted in user successfully");
    }
  }
  );
});



app.post("/addProduct/:id", (req, res) => {
  let upload = multer({ storage: storage }).single("itemImage");
  upload(req, res, function (err) {
    if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }


    const userId = req.params.id;
    const itemName = req.body.itemName;
    const itemCategory = req.body.itemCategory;
    const itemDescription = req.body.itemDescription;
    const itemPrice = req.body.itemPrice;
    const itemCount = req.body.itemCount;
    const itemImage = req.file.filename;

    const newItem = new ItemsModel({
      userId: userId,
      itemName: itemName, itemDescription: itemDescription, itemPrice: itemPrice,
      itemCount: itemCount, itemImage: itemImage, itemCategory: itemCategory
    });
    newItem.save()
      .then((data) => {
        console.log("Product added successfully");
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "some error occured" });
      });
  });
});


app.post("/getAllProducts/:id", (req, res) => {
  const id = req.params.id;
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  const term = req.body.searchTerm;
  if (term) {
    console.log("In term");
    result = ItemsModel.find({ "itemName": { $regex: "/^" + term + "/", $options: 'i' } },
      (err, result) => {
        if (err) {
          res.send(err + "err");
          console.log(err);
        } else {
          console.log("retrieving")
        }
      }
    ).skip(skip).limit(limit);
    res.status(200).json({ success: true, result, postSize: result.length });
  } else {
    ItemsModel.find({},
      (err, result) => {
        console.log(result.length + "result in db");
        if (err) {
          console.log("err");
          res.send(err + "err");
        } else {
          console.log(result + "result");
          res.status(200).json({ success: true, result, postSize: result.length });
        }
      }
    );
  }
});

app.get("/getItemById/:itemId", (req, res) => {
  const id = req.params.itemId;
  ItemsModel.find({ _id: id },
    (err, result) => {
      console.log(result);
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.get("/getAllItems", (req, res) => {
  ItemsModel.find({}, (err, result) => {
    console.log(result);
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/updateItemById/:itemId", (req, res) => {
  const id = req.params.itemId;
  const itemName = req.body.itemName;
  const itemDescription = req.body.itemDescription;
  const itemPrice = req.body.itemPrice;
  const itemCount = req.body.itemCount;
  const itemCategory = req.body.itemCategory;

  console.log("In update item post");
  console.log(itemDescription);
  console.log(itemName);
  console.log(id);

  UserModel.findByIdAndUpdate(id, {
    itemName: itemName,
    itemPrice: itemPrice, itemDescription: itemDescription, itemCount: itemCount,
    itemCategory: itemCategory
  },
    (err, result) => {
      console.log(result.itemName);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});





app.put("/updateShopImageById/:id", (req, res) => {
  console.log("In edit shop details put method");
  // const uploadSingle = uploadS3("etsyclonebucket").single("shopImage");
  // uploadSingle(req, res, async (err) => {
  //   if (err) {
  //     console.log(err)
  //     return res.status(400).json({ message: err.message });
  //   }
  let upload = multer({ storage: shopStorage }).single("shopImage");
    upload(req, res, function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

    const userId = req.params.id;
    const shopImage = req.file.filename;


    UserModel.findByIdAndUpdate(userId, { shopImage: shopImage },
      (err, result) => {
        if (err) {
          console.log(err + "err");
          res.send(err);
        } else {
          res.send({ success: true, result });
        }
      }
    );
  });
});

app.get("/getSearchItems/:searchValue", (req, res) => {

  const searchValue = new RegExp("^" + req.params.searchValue);
  console.log(searchValue);
  ItemsModel.find({ itemName: { $regex: searchValue } },

    (err, result) => {
      console.log(result);
      if (err) {
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});


app.put("/updateUser/:id", async (req, res) => {
  // const uploadSingle = uploadS3("etsyclonebucket").single("userImage");
  let upload = multer({ storage: shopStorage }).single("userImage");
  upload(req, res, function (err) {
    if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    const userId = req.params.id;
    const userName = req.body.userName;
    const gender = req.body.gender;
    const city = req.body.city;
    // const dob = req.body.dob;
    const userImage = req.file.filename;
    const about = req.body.about;
    UserModel.findByIdAndUpdate(userId, {
      userName: userName, city: city, gender: gender, about: about, profilePic: userImage
    },
      (err, result) => {
        console.log(result);
        if (err) {
          console.log(err);
          res.send({ message: "error" });
        } else {
          res.send({ message: "success", result });
        }
      }
    );
  });
});

// app.get("/getItems",passport.authenticate("jwt", { session: false }), (req, res) => {
  app.get("/getItems", (req, res) => {
  console.log("Getting all products in home");
  ItemsModel.find({}, (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ success: true, result });
    }
  });
});

// app.get("/getItems", (req, res) => {
//   console.log("get items");
//     kafka.make_request('getItems', req.body, function(err, results) {
//       if (err) {
//         return res.json({
//           status: "error",
//           msg: "System Error, Try Again."
//         })
//       } else {
//         return res.json(results);
//         console.log("----> getItems backend: " + results);
//         res.end();
//       }
//     });
// });



app.post("/addFavourite", (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  const itemId = req.body.itemId;
  const newFav = new FavouritesModel({
    itemId: itemId, userId: userId
  });
  console.log(itemId, "itemId")

  newFav.save({},
    (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});



  // const reqObj = {
  //   query: req.query, params: req.params, body: req.body,
  // }
  // kafka.make_request("addfavourites", reqObj, function (err, results) {
  //   if (err) {
  //     console.log("err", err);
  //     return res.status(500).json(err);
  //   } else {
  //     const { status_code, response } = results;
  //     console.log(response);
  //     return res.status(status_code).json(response);
  //     //return res.send({ success: true, response.data });
  //   }
  // }); } );

app.post("/addCart", (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  const itemId = req.body.itemId;
  const qty = req.body.qty;
  const purchase = 0;
  const orderid = "0";
  const gift = "";
  console.log("orderid ", orderid)
  const newFav = new CartModel({
    itemId: itemId, userId: userId, orderId: orderid, qty: qty, purchase: purchase, gift: gift
  });
  console.log(itemId, "itemId")
  console.log("qty", qty)
  console.log("newFav ",newFav)

  newFav.save({},
    (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});

app.get("/getFavourites/:id", async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  console.log("Getting all Favourites in home");
  try {
    result = await FavouritesModel.find({ userId: userId }
    ).populate("itemId");
    console.log(result)

    res.send({ success: true, result });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/getCart/:id", async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  console.log("Getting all carttimes in home");
  try {
    result = await CartModel.find({ userId: userId, purchase: 0,qty: {$gt:0} }
    ).populate("itemId");
    console.log("cart", result)

    res.send({ success: true, result });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});


app.delete("/deleteFavourite/:itemId/:userId", (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.params.userId;
  console.log("Deleting Fav Item");

  FavouritesModel.findOneAndRemove({ itemId: itemId, userId: userId },

    (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});

app.delete("/deleteCart/:cartId", (req, res) => {
  const cartId = req.params.cartId;
  console.log("Deleting cart Item");

  CartModel.findByIdAndDelete(cartId,

    (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
        console.log("delete update")
      }
    }
  );
});

app.post("/updateQty/:id/:qty", (req, res) => {

  const id = req.params.id;
  const qty = req.params.qty;
  console.log("updating qty")
  CartModel.findByIdAndUpdate(id, { qty: qty }, (err, result) => {
    if (err) {
      console.log("couldnt update")
      console.log(err);
    } else {
      console.log(result);
      // res.send(result);
      res.send("Qty updated");
      console.log("qty update")
    }
  }
  );
});

app.post("/giftMessage/:id/", (req, res) => {

  const id = req.params.id;
  const gift = req.body.qty;
  console.log("updating gift")
  CartModel.findByIdAndUpdate(id, { gift: gift }, (err, result) => {
    if (err) {
      console.log("couldnt update")
      console.log(err);
    } else {
      console.log(result);
      // res.send(result);
      res.send("Qty updated");
      console.log("qty update")
    }
  }
  );
});





app.get("/purchase/:id", (req, res) => {

  const id = req.params.id;
  let uniqueOrderId = Math.floor(Math.random() * 1000000)

  console.log("updating purchase")
  CartModel.updateMany({ userId: id , purchase: 0}, { $set: { orderId: uniqueOrderId, purchase: 1} }, (err, result) => {
    if (err) {
      console.log("couldnt update")
      console.log(err);
    } else {
      console.log(result);
      // res.send(result);
      res.send("purchase updated");
      console.log("qty update")
    }
  }
  );
});





app.get("/getPurchases/:id", async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  console.log("Getting all purchases in home");
  try {
    result = await CartModel.find({ userId: userId, purchase: 1, qty: {$gt:0} }
    ).populate("itemId").sort({"updatedAt" : -1});
    console.log("cart", result)

    res.send({ success: true, result });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("SERVER RUNS PERFECTLY ON ", PORT);
});

module.exports = app;