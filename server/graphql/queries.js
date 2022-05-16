const { User, Items, Cart, CartItem,PurchaseItem} = require("../graphql/typeDef");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");
const itemsDb = require("../models/Items");
const CartModel = require("../models/Cart");


const query = new GraphQLObjectType({
  name: "query",
  fields: {
    getItemsList: {
      type: new GraphQLList(Items),
      resolve(parent, args) {
        return itemsDb.find({});
      },
    },
    getCartList: {
      type: new GraphQLList(CartItem),
      args: {
        userId: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await CartModel.find({ userId: args.userId, purchase: 0, qty: {$gt:0} }
          ).populate("itemId").sort({"updatedAt" : -1});
          console.log("userId", args.userId)

        return result;

      },
    },
    getPurchases: {
      type: new GraphQLList(PurchaseItem),
      args: {
        userId: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const result = await CartModel.find({ userId: args.userId, purchase: 1, qty: {$gt:0} }
          ).populate("itemId").sort({"updatedAt" : -1});
          console.log("cartis", result)
          console.log("userId", args.userId)

        return result;

      },
    },
  },
});



module.exports = {
  query,
};