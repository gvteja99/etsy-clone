const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const models = require("./models");
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

// storage

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

//static images folder
app.use("/Images", express.static("./Images"));

/////////////////////////////////////////////////////
app.post("/register", async (req, res) => {
  console.log("Register");
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
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
  });
});

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
  UserModel.find({ email: email, password: password },
    (err, result) => {
      if (err) {
        console.log("sign in error");
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.cookie("user", result[0].name, {
          maxAge: 900000,
          httpOnly: false,
          path: "/",
        });
        req.session.user = result;
        res.send(result);
        console.log("result");
      } else {
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

app.post("/addProduct/:id", async (req, res) => {
  try {
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
      const itemDescription = req.body.itemDescription;
      const itemPrice = req.body.itemPrice;
      const itemCount = req.body.itemCount;
      const itemImage = req.file.filename;
      const itemCategory = req.body.itemCategory;

      const newItem = new ItemsModel({userId,
        itemName: itemName, itemDescription: itemDescription, itemPrice: itemPrice,
        itemCount: itemCount, itemImage: itemImage, itemCategory: itemCategory
      });
      newItem.save();
      res.send({ message: "success" })
      //   {},
      //   (err, result) => {
      //     if (err) {
      //       console.log(err);
      //       res.send({ message: "error" });
      //     } else {
      //       res.send({ message: "success" });
      //     }
      //   }
      // );
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/getAllProducts/:id", (req, res) => {
  const id = req.params.id;
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  const term = req.body.searchTerm;
  if (term) {
    console.log("In term");
      result = ItemsModel.find( { "itemName": {$regex: "/^" + term+ "/", $options: 'i' }},
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
          res .status(200) .json({ success: true, result, postSize: result.length });
        }
      }
    );
  }
});

app.get("/getItemById/:itemId", (req, res) => {
  const id = req.params.itemId;
  ItemsModel.find({_id : id},
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

  UserModel.findByIdAndUpdate(id, { itemName: itemName, 
    itemPrice : itemPrice, itemDescription : itemDescription, itemCount : itemCount,
     itemCategory :itemCategory},
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
  try {
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
  
      UserModel.findByIdAndUpdate(id, {shopImage:shopImage},
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
  } catch (err) {
    console.log(err);
  }
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("SERVER RUNS PERFECTLY!");
});

module.exports = app;