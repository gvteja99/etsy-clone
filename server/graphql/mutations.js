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
            fullAddress: null, city: null, phoneNumber: null, dob: null, gender: null, profilePic: null,
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

    // findShopDuplicates: {
    //   type: User,
    //   args: {
    //     shopName: { type: GraphQLString },
    //   },
    //   resolve(parent, args) {
    //     UserController.findShopDuplicates(args.shopName);
    //     return args;
    //   },
    // },
    // updateUserProfile: {
    //   type: User,
    //   args: {
    //     username: { type: GraphQLString },
    //     email: { type: GraphQLString },
    //     password: { type: GraphQLString },
    //   },
    //   resolve(parent, args) {
    //     UserController.create(args.username, args.email, args.password);
    //     return args;
    //   },
    // },
  },
});

module.exports = {
  mutation,
};