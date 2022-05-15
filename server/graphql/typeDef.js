const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLFloat,
    GraphQLInputObjectType,
  } = require("graphql");
  
  const User = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      _id: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      fullAddress: { type: GraphQLString },
      city: { type: GraphQLString },
      phoneNumber: { type: GraphQLString },
      dob: { type: GraphQLString },
      gender: { type: GraphQLString },
      profilePic: { type: GraphQLString },
      about: { type: GraphQLString },
      shopName: { type: GraphQLString },
      shopImage: { type: GraphQLString },
    }),
  });
  
  const Items = new GraphQLObjectType({
    name: "Items",
    fields: () => ({
      _id: { type: GraphQLString },
      userId: { type: GraphQLString },
      itemName: { type: GraphQLString },
      itemCategory: { type: GraphQLString },
      itemPrice: { type: GraphQLInt },
      itemDescription: { type: GraphQLString },
      itemCount: { type: GraphQLInt },
      itemImage: { type: GraphQLString },
    }),
  });
  
  const Cart = new GraphQLObjectType({
    name: "Cart",
    fields: () => ({
      _id: { type: GraphQLString },
      itemId: { type: GraphQLString },
      userId: { type: GraphQLString },
      orderId: { type: GraphQLString },
      qty: { type: GraphQLInt },
      purchase: { type: GraphQLInt },
      gift: { type: GraphQLString },
    }),
  });

  module.exports = {
    User,
    Items,
    Cart,
    
  };