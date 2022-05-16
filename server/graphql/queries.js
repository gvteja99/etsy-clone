const { User, Items, Cart } = require("../graphql/typeDef");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");
const itemsDb = require("../models/Items");

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
      type: new GraphQLList(Cart),
      args: {
        userId: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const cartItems = await cartsdb
          .find({ userId: args.userId })
          .populate("itemId")
          .exec();
        console.log(cartItems);
        return cartItems;
      },
    },
  },
});



module.exports = {
  query,
};