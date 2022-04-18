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
import Pagination from './Pagination';


const Purchases = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const products = useSelector(getCart);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(5);

    // localStorage.setItem("postsPerPage", 5);
    // let postsPerPage = localStorage.getItem("postsPerPage");

    // Get current posts

    const qtyChangeHandler = (qty) => {

        console.log("pagination");
        console.log("qty",qty);

        setPostsPerPage(qty);
        
        // // {currentPage === 1 ?(
        // // window.location.pathname = "/purchase"):(<></>);}

        // localStorage.setItem("postsPerPage", qty);
        // postsPerPage = localStorage.getItem("postsPerPage");

        console.log("postsPerPage",postsPerPage);};

    useEffect(() => { getCItems(); }, []);

    const getCItems = () => {
        setLoading(true);
        Axios.get("http://localhost:4000/getPurchases/" + user.id).then(
            (response) => {
                //console.log(response.data.result);
                setPosts(response.data.result);
                dispatch(createCart(response.data.result));
                if (response.data.success === true) {
                    setLoading(false);
                }
            });
    };

    // Change page

    console.log("currremt ", currentPage)
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    console.log("current posts :", currentPosts)

    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
        console.log("pageNumber", pageNumber);
        console.log('currentPage', currentPage);

    };

    return (
        <>
            <Navbar />
            <Hoverbar />
            <hr></hr>
            <div className="cartscreen">
                <div className="cartscreen__left">
                    <h2>Previous Purchases</h2>
                    <p>Number of purchases per page</p><select value={postsPerPage} onChange={(e) => qtyChangeHandler(e.target.value)}  >
                        {[2, 5, 10].map((x) => (
                            <option key={x} value={x}>
                                {x}
                            </option>
                        ))}
                    </select>
                    {currentPosts.length === 0 ? (<div> You have no previous purchases. <Link to="/">Go Back</Link> </div>) : (
                        currentPosts.map((item) => (

                            <div className="cart_pag" style={{ display: "flex", width: "100%", height: "200px", }} >
                                <div className="cartitem">
                                    <p className="cartitem__price">Order Number: {item._id}</p>
                                    <p className="cartitem__price">Purchased On: {item.updatedAt}</p>
                                    <Link to={`/product/${item.product}`} className="cartItem__name">
                                        <p>{item.itemId.itemName}</p>
                                    </Link>
                                    <div className="cartitem__image">
                                        <img src={item.itemId.itemImage} alt={item.itemId.itemName} width={150} height={100} />
                                    </div>

                                    <p className="cartitem__price">${item.itemId.itemPrice}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
                </div>

            </div>

        </>
    );
};

export default Purchases;