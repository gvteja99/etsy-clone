import Axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCartItem } from "../features/cartItemsSlice";
import { addProductToCart, addQtyToCart, getAllCartProducts, getFinalCartProducts, productOverview, } from "../features/cartSlice";
import userSlice, { selectUser } from "../features/userSlice";
import Hoverbar from "./Hoverbar";
import Navbar from "./Navbar";
import "./ProductOverView.css";
import { getCartItems } from "../features/cartItemsSlice";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  gql,
} from "@apollo/client";
import { ADDCART } from "../graphql/mutation";

function ProductOverView() {
  const [addcart] = useMutation(
    ADDCART,
    {
      onCompleted(res) {
        dispatch(
          createCartItem({
            itemId: productView.itemId,
            itemName: productView.itemName,
            itemDescription: productView.itemDescription,
            itemImage: productView.itemImage,
            itemPrice: productView.itemPrice,
            itemCount: productView.itemCount,
            itemId: productView.itemId,
            qty: Number(qty),
          })
        );
        window.location.pathname = "/cart";
      },
      onError(e) {
        console.log(e);
      },
    }
  );

  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const productView = useSelector(getAllCartProducts);
  // const cartProduct = useSelector(getAllCartProducts);
  // const cartItems = useSelector(getCartItems);

  const addToCartHandler = (itemId, userId) => {
    addcart({
      variables: {
        userId: userId,
        itemId: itemId,
        qty: Number(qty) },
    });
  };
  return (
    <>
      <Navbar />
      <Hoverbar />
      <hr></hr>

      <div className="productscreen">
        <div className="productscreen__left">
          <div className="left__image">
            <img
              src={ "/Images/" +productView.itemImage}
              // src={require( productView.itemImage)}
              alt={productView.itemName}
              //   height={300}
              width={450}
            />
          </div>

          <div className="left__info">
            <p className="left__name">{productView.itemName}</p>
            <p>Price: ${productView.itemPrice}</p>
            <p>Description: {productView.itemDescription}</p>
          </div>
        </div>
        <div className="productscreen__right">
          <div className="right__info">
            <p>
              Price:
              <span>${productView.itemPrice}</span>
            </p>
            <p>
              Status:
              <span>
                {productView.itemCount > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </p>
            <p>
              Qty
              <select value={qty} onChange={(e) => setQty(e.target.value)}>
                {[...Array(productView.itemCount).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <button type="button" onClick={() => {
                addToCartHandler(productView._id, user.id);}}>
                
                Add To Cart
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductOverView;
