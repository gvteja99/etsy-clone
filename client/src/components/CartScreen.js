import "./CartScreen.css";
import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../features/userSlice";
const [items, SetItems] = useState([]);

// Components
import CartItem from "../components/CartItem";

// Actions
import { addToCart, removeFromCart } from "../redux/actions/cartActions";

const CartScreen = () => {
  const user = useSelector(selectUser);
  useEffect(() => { getCartItems(); }, []);


  const getCartItems = () => {
    Axios.get("http://3.101.105.59:4000/getCart/" + user.id).then(
      (response) => {
        console.log(response.data.result);
        if (response.data.success === true) {
          for (let i = 0; i < response.data.result.length; i++) {
            console.log("bleh", response.data.result[i]._id);
            
            const updateItems = [
              ...items,
              {
                
                userId: response.data.result[i].userId,
                itemName: response.data.result[i].itemName,
                itemCategory: response.data.result[i].itemCategory,
                itemPrice: response.data.result[i].itemPrice,
                itemDescription: response.data.result[i].itemDescription,
                itemCount: response.data.result[i].itemCount,
                itemImage: response.data.result[i].itemImage,
                itemId: response.data.result[i]._id,
              },
            ];
            console.log(updateItems.itemId)
            console.log(updateItems.itemName)
            SetItems(updateItems);
            console.log("-------------geting all products----------------");
            console.log(items.itemId);
          }
          
          
        }
      }
    );
  };









  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);


  const { cartItems } = cart;

  useEffect(() => {}, []);

  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, qty));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.qty) + qty, 0);
  };

  const getCartSubTotal = () => {
    return cartItems
      .reduce((price, item) => price + item.price * item.qty, 0)
      .toFixed(2);
  };

  return (
    <>
      <div className="cartscreen">
        <div className="cartscreen__left">
          <h2>Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <div>
              Your Cart Is Empty <Link to="/">Go Back</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.product}
                item={item}
                qtyChangeHandler={qtyChangeHandler}
                removeHandler={removeFromCartHandler}
              />
            ))
          )}
        </div>

        <div className="cartscreen__right">
          <div className="cartscreen__info">
            <p>Subtotal ({getCartCount()}) items</p>
            <p>${getCartSubTotal()}</p>
          </div>
          <div>
            <button>Proceed To Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartScreen;
