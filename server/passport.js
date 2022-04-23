// const bleh =  require("passport-jwt");

// const mongoose = require("mongoose");
// const JwtStrategy = bleh.Strategy;
// const passport = require('passport');
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const UserModel = require("./models/Users");


// mongoose.connect( "mongodb+srv://etsy_user:etsy_password@etsycluster.yz62f.mongodb.net/etsy_database?retryWrites=true&w=majority", { useNewUrlParser: true, } );

// const usepassport =  (passport) => {
//     passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     // console.log({ email: jwt_payload });
//     // console.log("=========jwtpayload", jwt_payload);
//     UserModel.findOne({email: jwt_payload.email})
//         .then((customer) => {
//             // console.log("Customer", customer);
//             if (customer) {
//             return done(null, customer);
//             }
//             return done(null, false);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
//     }));
// }


// exports = module.exports =  usepassport();

// const { compareSync } = require('bcrypt');
// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy;
// const UserModel = require("./models/Users");

// passport.use(new LocalStrategy(
//     function (jwt_payload, done) {
//         UserModel.findOne({ email: email }, function (err, user) {
//             if (err) { return done(err); } //When some error occurs

//             if (!user) {  //When username is invalid
//                 return done(null, false, { message: 'Incorrect username.' });
//             }

//             // if (!compareSync(password, user.password)) { //When password is invalid 
//             //     return done(null, false, { message: 'Incorrect password.' });
//             // }

//             return done(null, user); //When user is valid
//         });
//     }
// ));

// //Persists user data inside session
// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// //Fetches session details using session id
// passport.deserializeUser(function (id, done) {
//     UserModel.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const passport = require("passport");
//var { secret } = require("./config");
const UserModel = require("./models/Users");

// Setup work and export for the JWT passport strategy
function auth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: "Randomstring"
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const email = jwt_payload.email;
            UserModel.findOne(email, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(null, results);
                }
                else {
                    callback(null, false);
                }
            });
        })
    )
}

exports.auth = auth;
// exports.checkAuth = passport.authenticate("jwt", { session: false });


