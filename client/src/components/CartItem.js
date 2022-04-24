import "./CartItem.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFinalCart, removeCartItem } from "../features/cartItemsSlice";
import { Delete } from "@material-ui/icons";
import Axios from "axios";
import { selectUser } from "../features/userSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [gift, SetGift] = useState(false);
 

  const qtyChangeHandler = (qty) => {

    console.log("qtyChangeHandler");

    Axios.post("http://localhost:4000/updateQty/" + item._id + "/" + qty)
      .then((response) => {
        console.log("Qty updated");
        // if(item.qty == 0){
        //   removeHandler(item._id);
        //   console.log("bleh0")
        // }
      })
      .catch((err) => {
        console.log(err);
      });

    window.location.pathname = "/cart";
  };

  const giftMessageHandler = (qty) => {

    console.log("giftMessageHandler");

    Axios.post("http://localhost:4000/giftMessage/" + item._id, {qty} )
      .then((response) => {
        console.log("gift messsage updated");
        
      })
      .catch((err) => {
        console.log(err);
      });

    // window.location.pathname = "/cart";
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

  const giftHandler = (gift) => {
    SetGift(true);
  }

  return (
    <div className="cart_pag" style={{ display: "flex", width: "100%", height: "200px", }} >
      <div className="cartitem">
        <div className="cartitem__image">
          <img src={ item.itemId.itemImage} alt={item.itemId.itemName} width={150} height={100} />
        </div>
        <Link to={`/product/${item.product}`} className="cartItem__name">
          <p>{item.itemId.itemName}</p>
        </Link>
        <p className="cartitem__price">${item.itemId.itemPrice}</p>
        <select value={item.qty} onChange={(e) => qtyChangeHandler(e.target.value)} className="cartItem__select" >
          {[...Array(item.itemId.itemCount).keys()].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {/* {item.qty == 0?removeHandler(item._id):<></>} */}
        <button className="cartItem__deleteBtn" onClick={() => removeHandler(item._id)} > <Delete /> </button>
        <div>
          <input
            type="checkbox"
            name="checkbox"
            id="checkbox"
            checked={gift}
            value={gift}
            onChange={e => {
              giftHandler(e.target.value);
            }}
          />
          <label for="checkbox"> Gift Card</label>
          {gift && (<div> <input type="gift" id="gift" placeholder="gift message" onChange={(event) => { giftMessageHandler(event.target.value); }} required /></div>
      )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
