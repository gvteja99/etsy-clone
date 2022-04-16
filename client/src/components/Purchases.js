import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import Axios from "axios";
import { createCart, getCart, } from "../features/purchaseSlice";
import { selectUser } from "../features/userSlice";
import Navbar from "./Navbar";
import Hoverbar from "./Hoverbar";
import "./CartItem.css";


const Purchases = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [finalAmount, setFinalAmount] = useState();

    const [items, SetItems] = useState([]);
    const products = useSelector(getCart);

    useEffect(() => { getCItems(); }, []);

    const getCItems = () => {
        Axios.get("http://localhost:4000/getPurchases/" + user.id).then(
            (response) => {
                console.log(response.data.result);
                dispatch(createCart(response.data.result));
                if (response.data.success === true) {
                }
            });
    };

    const getCartCount = () => {
        return products.reduce((qty, item) => Number(item.qty) + qty, 0);
    };

    const getCartSubTotal = () => {
        return products
            .reduce((price, item) => price + item.itemId.itemPrice * item.qty, 0).toFixed(2);
    };

    const handleCheckOut = () => {
        Axios.get("http://localhost:4000/purchase/" + user.id)
            .then((response) => {
                console.log("Purchased");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            <Navbar />
            <Hoverbar />
            <hr></hr>
            <div className="cartscreen">
                <div className="cartscreen__left">
                    <h2>Previous Purchases</h2>
                    {products.length === 0 ? (<div> You have no previous purchases. <Link to="/">Go Back</Link> </div>) : (
                        products.map((item) => (
                            //   <CartItem
                            //     key={item.product}
                            //     item={item}
                            //     getCartSubTotal={getCartSubTotal}
                            //     getCartCount={getCartCount}

                            //   />
                            <div className="cart_pag" style={{ display: "flex", width: "100%", height: "200px", }} >
                                <div className="cartitem">
                                <p className="cartitem__price">Order Number: {item._id}</p>
                                <p className="cartitem__price">Purchased On: {item.updatedAt}</p>
                                <Link to={`/product/${item.product}`} className="cartItem__name">
                                        <p>{item.itemId.itemName}</p>
                                    </Link>
                                    <div className="cartitem__image">
                                        <img src={"/Images/" + item.itemId.itemImage} alt={item.itemId.itemName} width={150} height={100} />
                                    </div>
                                    
                                    <p className="cartitem__price">${item.itemId.itemPrice}</p>
                                    
                                    {/* <select value={item.qty} onChange={(e) => qtyChangeHandler(e.target.value)} className="cartItem__select" >
                                        {[...Array(item.itemId.itemCount).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select> */}
                                    {/* <button className="cartItem__deleteBtn" onClick={() => removeHandler(item._id)} > <Delete /> </button> */}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Purchases;