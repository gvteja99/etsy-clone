import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import Axios from "axios";
import {  createCartItem, getCartItems, } from "../features/cartItemsSlice";
import { selectUser } from "../features/userSlice";
import Navbar from "./Navbar";
import Hoverbar from "./Hoverbar";

const CartScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [finalAmount, setFinalAmount] = useState();
  const finalCartProducts = useSelector(getCartItems);
  const [items, SetItems] = useState([]);
  const products = useSelector(getCartItems);

  useEffect(() => {
    getCItems();
  }, []);

  const getCItems = () => {
    Axios.get("http://localhost:4000/getCart/" + user.id).then(
      (response) => {
        console.log(response.data.result);
        dispatch(createCartItem(response.data.result));
        if (response.data.success === true) {
 } } ); };

  const removeFromCartHandler = (id) => {
    // dispatch(removeFromCart(id));
  };

  const getCartCount = () => {
    return products.reduce((qty, item) => Number(item.qty) + qty, 0);
  };

  const getCartSubTotal = () => {
    return products
      .reduce((price, item) => price + item.itemId.itemPrice * item.qty, 0) .toFixed(2);
  };

  
  const handleCheckOut = () => {


    // Axios.post("http://localhost:4000/purchase/" + user.id )
    //     .then((response) => {
    //       console.log("Qty updated");
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
        
    console.log(JSON.stringify(items));

    localStorage.setItem("purchase", JSON.stringify(items));
    window.location.pathname = "/purchase";
  };

  return (

    <>
      <Navbar />
      <Hoverbar />
      <hr></hr>
      <div className="cartscreen">
        <div className="cartscreen__left">
          <h2>Shopping Cart</h2>
          <h3>{products.length}</h3>
          {products.length === 0 ? ( <div> Your Cart Is Empty <Link to="/">Go Back</Link> </div> ) : (
            products.map((item) => (
              <CartItem
                key={item.product}
                item={item}
                getCartSubTotal={getCartSubTotal}
                getCartCount={getCartCount}
                // qtyChangeHandler={qtyChangeHandler}
                // removeHandler={removeFromCartHandler}
              />
            ))
          )}
        </div>
        <div className="cartscreen__right" style={{ width: "30%" }}>
          <div className="cartscreen__info">
            <p>Subtotal ({getCartCount()}) items</p>
            <p>${getCartSubTotal()}</p>
          </div>
          <div>
            <button
              onClick={() => {
                handleCheckOut();
              }}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartScreen;