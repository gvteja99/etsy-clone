const { Cart, Items, User } = require("../graphql/typeDef");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");

const UserModel = require("../models/Users");
const ItemsModel = require("../models/Items");
const FavouritesModel = require("../models/Favourites");
const CartModel = require("../models/Cart");



const mutation = new GraphQLObjectType({
  name: "userMutation",
  fields: {
    register: {
      type: User,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        const name = args.name;
        const email = args.email;
        const password = args.password;
        const newUser = new UserModel({
            name: name, email: email, password: password,
            fullAddress: null, city: "Daly City", phoneNumber: null, dob: null, gender: null, profilePic: null,
            about: null, shopName: null, shopImage: null
          });
          newUser.save()
        return newUser;
      },
    },
    addcart: {
      type: Cart,
      args: {
        userId: { type: GraphQLString },
        itemId: { type: GraphQLString },
        qty: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        const newFav = new CartModel({
          itemId: args.itemId, userId: args.userId, orderId: "0", qty: args.qty, purchase: 0, gift: ""
        });
        await newFav.save();
        return newFav;
      },
    },

    additem: {
      type: Items,
      args: {
        userId : { type: GraphQLString },
        itemName : { type: GraphQLString },
        itemCategory: { type: GraphQLString },
        itemDescription : { type: GraphQLString },
        itemPrice  : { type: GraphQLInt },
       itemImageurl : { type: GraphQLString },
      },
      async resolve(parent, args) {
        const newItem = new ItemsModel({
          userId: args.userId, itemName: args.itemName, itemCategory: args.itemCategory, itemDescription: args.itemDescription, itemPrice: args.itemPrice, 
          itemImageurl: args.itemImageurl, 
        });
        await newItem.save();
        return newItem;
      },
    },

    createShop: {
      type: User,
      args: {
        shopName: { type: GraphQLString },
        id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log("HI")
        await UserModel.findByIdAndUpdate(args.id, { shopName: args.shopName })
        return args;
      },
    },

    updateUser:{
      type: User,
      args: {
        id: { type: GraphQLString },
        name : { type: GraphQLString },
        email : { type: GraphQLString },
        fullAddress : { type: GraphQLString },
        city : { type: GraphQLString },
        dob : { type: GraphQLString },
        gender : { type: GraphQLString },
        aebout : { type: GraphQLString },
      },
      async resolve(parent, args) {
        const id = args.id
        const name = args.name;
        const email = args.email;
        const fullAddress = args.fullAddress;
        const city = args.city;
        const dob = args.dob;
        const gender = args.gender;
        const about = args.about;
       
        UserModel.findByIdAndUpdate(id, {
            name: name, email: email, password: password,
            fullAddress: fullAddress, city: null, city: city, dob: dob, gender: gender, about: about,
             shopName: null, shopImage: null
          });
         
        return args;
      },
      
    },

    findShopDuplicates: {
      type: User,
      args: {
        shopName: { type: GraphQLString },
      },
      resolve(parent, args) {
        UserController.findShopDuplicates(args.shopName);
        return args;
      },
    },

  },
});

module.exports = {
  mutation,
};