import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favouritesList, getAllItems, getAllProducts, getProducts, updateFavourites, } from "../features/productsSlice";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import { selectUser } from "../features/userSlice";
import { useQuery, gql } from "@apollo/client";

import { productOverview } from "../features/cartSlice";
import { GET_ITEM_LIST } from "../graphql/queries";




function EtsyBody() {
  const { error, loading, data } = useQuery(GET_ITEM_LIST);
  const dispatch = useDispatch();
  const products = useSelector(getAllProducts);
  const user = useSelector(selectUser);
  
  const [favourites, setFavourites] = useState([]);
  const [items, SetItems] = useState([]);
  const [favouriteIcon, setFavoutriteIcon] = useState(false);


  useEffect(() => {
    console.log("data from graphql");
    console.log(data);
    if (data !== undefined) {
      dispatch(getAllItems(data.getItemsList));
      SetItems(data.getItemsList);
    }
  }, [data]);

  const getItems = () => {
    const headers = { 
      'Authorization': localStorage.getItem('token'),
  };
  console.log("blehgetitems")
    Axios.get("http://localhost:4000/getItems",{headers}).then((response) => {
      if (response.data.success === true) {
        console.log(response.data.result);
        dispatch(getAllItems(response.data.result));

        for (let i = 0; i < response.data.result.length; i++) {
          console.log("bleh", response.data.result[i]._id);
          console.log("items bleh" , items)
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
    });
  };

  const getFavourites = () => {
    if (user !== null) {
      Axios.get("http://localhost:4000/getFavourites/" + user.id).then(
        (response) => {
          console.log("user id for favourites" + user.id);
          console.log(response.data.result);
          if (response.data.success === true) {
            dispatch(favouritesList(response.data.result));
          }
        }
      );
    }
  };

  const handleFavourite = (itemId, userId) => {
    console.log("Favourites added" + itemId + userId);
    console.log(itemId,"itemIdbleh")
    Axios.post("http://localhost:4000/addFavourite", {
      
      itemId: itemId,
      userId: userId,
      
    }).then((response) => {
      if (response.data.success === true) {
        console.log()
        console.log(response.data.result);
        console.log("new fav added");
        // setFavoutriteIcon(true);
      }
    });
  };

  const handleOpenImage = (pro) => {
    dispatch(productOverview(pro));
    window.location.pathname = "/productOverview";
  };

  var renderProducts = null;
  renderProducts = products.map((pro) => {
    return (
      <div className="home_cards col-md-4 mb-4">
        <div className="home_card card">
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "5px",
            }}
            className="favourite_icon"
            onClick={() => {
              handleFavourite(pro._id, user.id);
            }}
          >
  
            <FavoriteTwoToneIcon />
           
          </div>
          <img src={"/Images/" +pro.itemImage} className="home_image card-img-top" alt="..." onClick={() => { handleOpenImage(pro); }} />
          <p className> Price: {localStorage.getItem("preferedCurrency")} {pro.itemPrice} </p>

          <div className="card-body">
            <h5 className="card-title">{pro.itemName}</h5>

            <p className="card-text">{pro.itemDescription}</p>
            <button className="btn-sm btn-dark">
              View Product
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      className="etsy_body"
      style={{
        // backgroundColor: "red",
        marginTop: "10%",
        marginLeft: "3%",
        marginRight: "3%",
      }}
    >
      <div className="container-fluid mx-1">
        <div className="row mt-5 mx-1">
          <div className="col-md-12">
            {/* {products.length} */}
            <div className="row">{renderProducts}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EtsyBody;
