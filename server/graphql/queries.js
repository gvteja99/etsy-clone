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
  },
});

module.exports = {
  query,
};