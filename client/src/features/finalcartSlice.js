import { createSlice } from "@reduxjs/toolkit";

export const finalcartSlice = createSlice({
  name: "finalcartitems",
  initialState: {
    cart: [],
    finalCart: [],
  },
  reducers: {
    // by id
    createCart: (state, action) => 
    // {
    //   const exist = state.cartItems.findIndex(
    //     (ele) => ele.itemId === action.payload.itemId
    //   );
    //   console.log(exist + "----------------------------: exist");
    //   if (exist !== -1) {
    //     state.cartItems[exist] = {
    //       ...state.cartItems[exist],
    //       ...action.payload,
    //     };
    //   } else {
    //     state.cartItems.push(action.payload);
    //   }
    // },
    {
      state.cart = action.payload;
    },
    removeCartItem: (state, action) => {
      console.log("----------------------------: deleted" + action.payload);
      let index = state.cartItems.findIndex(
        ({ id }) => id === action.payload.id
      );
      state.cartItems.splice(index, 1);
      // state.cartItems.splice(action.payload, 1);
      // const item = state.cartItems.filter(
      //   (ele) => ele.itemId === action.payload
      // );
      //   state.cartProducts = null;
      // console.log(item + "----------------------------: deleted");
    },
    updateCartItem: (state, action) => {
      state.cartItems = action.payload;
    },

    createFinalCart: (state, action) => {
      const exist = state.cartItems.findIndex(
        (ele) => ele.itemId === action.payload.itemId
      );
      console.log(exist + "----------------------------: exist");
      if (exist !== -1) {
        state.cartItems[exist] = {
          ...state.cartItems[exist],
          ...action.payload,
        };
      } else {
        state.cartItems.push(action.payload);
      }
    },
  },
});

export const {
    createCart,
  removeCartItem,
  updateCartItem,
  createFinalCart,
} = finalcartSlice.actions;

export const getCart = (state) => state.finalcart.cart;
export const getFinalCart = (state) => state.finalcart.finalCart;

export default finalcartSlice.reducer;

