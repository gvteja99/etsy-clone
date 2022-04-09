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
    {useNewUrlParser: true,}
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
  const newUser = new UserModel({name: username,email: email,password: password,
    fullAddress:null,city:null,phoneNumber:null,dob:null,gender:null,profilePic:null,
    about:null,shopName:null,shopImage:null});
  await newUser.save({}, (err, result) => {
    if (err) {
      console.log("err",err);
      res.json(err);
    } else { 
      console.log(result);
      res.send({ success: true, result });
    }
  });});

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
    UserModel.find({email:email, password: password},
      (err, result) => {
        if (err) {
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
      UserModel.find({shopName:shopName},
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
    UserModel.find({_id:userId},(err, result) => {
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
      UserModel.findByIdAndUpdate(_id,{shopName : shopName},(err, result) => {
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

  // app.put ("/update", async (req, res) => {
  //   const newFoodName = req.body.newFoodName;
  //   const id = req.body.id;
  //   try {
  //    await FoodModel.findById(id, (err, updatedFood) => {
  //       updatedFood. foodName = newFoodName;
  //       updatedFood.save();
  //       res.send ("update");
  //    } catch (err) {
  //     console. log(err);
  // });



const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("SERVER RUNS PERFECTLY!");
});

module.exports = app;