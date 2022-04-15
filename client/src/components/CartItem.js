import "./CartItem.css";
import { Link } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFinalCart, removeCartItem } from "../features/cartItemsSlice";
import { Delete } from "@material-ui/icons";
import Axios from "axios";
import { selectUser } from "../features/userSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const qtyChangeHandler = (qty) => {

    console.log("qtyChangeHandler");

    Axios.post("http://localhost:4000/updateQty/" + item._id + "/" + qty)
        .then((response) => {
          console.log("Qty updated");
        })
        .catch((err) => {
          console.log(err);
        });

        window.location.pathname = "/cart";
    
  };

  const removeHandler = (id) => {
    console.log("remove");
    dispatch(removeCartItem(id));
    Axios.delete("http://localhost:4000/deleteCart/" + id)
        .then((response) => {
          console.log("cart updated");
        })
        .catch((err) => {
          console.log(err);
        });

        window.location.pathname = "/cart";
   
  };

  return (
    <div className="cart_pag" style={{ display: "flex", width: "100%", height: "200px", }} >
      <div className="cartitem">
        <div className="cartitem__image">
          <img src={"/Images/" + item.itemId.itemImage} alt={item.itemId.itemName} width={150} height={100} />
        </div>
        <Link to={`/product/${item.product}`} className="cartItem__name">
          <p>{item.itemId.itemName}</p>
        </Link>
        <p className="cartitem__price">${item.itemId.itemPrice}</p>
        <select value={item.qty} onChange={(e) => qtyChangeHandler(e.target.value)} className="cartItem__select" >
          {[...Array(item.itemId.itemCount).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>
        <button className="cartItem__deleteBtn" onClick={() => removeHandler(item._id)} > <Delete /> </button>
      </div>
    </div>
  );
};

export default CartItem;
