import React, { useState } from "react";
import Axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeShop, selectUser, updateUser } from "../features/userSlice";
import Navbar from "./Navbar";
import Hoverbar from "./Hoverbar";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  gql,
} from "@apollo/client";
import { CREATESHOP } from "../graphql/mutation";

function checkShopName() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [createshop] = useMutation(
    CREATESHOP,
    {
      onCompleted(res) {
        dispatch(
          updateUser({
            shopName: shopName,
          })
        );
        window.location.pathname = "/shopHome";
      },
      onError(e) {
        console.log(e);
      },
    }
  );
  const shopApi = async () => {
    const body = {
      
      
    };
    console.log("body", body);
    try {
      createshop({
        variables: { 
          id: user.id,
          shopName: shopName,
        },
      });
    } catch (err) {
      console.log(err)
    }
  }

  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");

  const CheckAvailability = (shopName) => {
    console.log(shopName.length + " in check availability");

    if (shopName.length < 4) {
      setError("Minimum 4 characters required");
    } else {
      setError("Available");
      Axios.post("http://localhost:4000/findShopDuplicates/", {
        shopName: shopName,
      })
        .then((response) => {
          if (response.data.message === "duplicate") {
            setError("Not Available");
          } else if (response.data.message === "No duplicates") {
            setError("Available");
          }
        })
        .catch((err) => {
          setError("Shop Name is not available");
        });
    }
  };


  const handleCreateShop = () => {
    shopApi();
    // Axios.post("http://localhost:4000/createShop/" + user.id, {
    //   shopName: shopName,
    // }).then((response) => {
    //   if (response.data) {
    //     console.log("Data Inserted successfully using post shop method");
    //     // console.log(response.data[0]);
    //     // console.log(response.data);
    //     dispatch(
    //       updateUser({
    //         shopName: shopName,
    //       })
    //     );
    //     window.location.pathname = "/shopHome";
    //   }
    // });
  };


  let errorMsg = null;
  console.log(error);
  if (error === "Available") {
    console.log(error + " in if block");
    errorMsg = (
      <div>
        <span style={{ color: "green" }}>{error}</span>
      </div>
    );
  } else {
    console.log(error + " in else block");
    errorMsg = (
      <div>
        <span style={{ color: "red" }}>{error}</span>
      </div>
    );
  }

  let createShopPage = null;
  if (error === "Available") {
    console.log(error + " in if block");
    createShopPage = (
      <div className="create_shop">
        <button onClick={handleCreateShop}>Create Shop</button>
      </div>
    );
  } else {
    console.log(error + " in else block");
    createShopPage = <div>{/* <span style={{ color: "red" }}></span> */}</div>;
  }

  let redirectVar = null;
  if (!user) {
    console.log("cookie is found " + user);
    redirectVar = <Navigate to="/home" />;
  }
  return (
    <div>
      {redirectVar}
      <Navbar />
      <Hoverbar />
      <hr></hr>
      <div className="sell_page">
        <h3>Name your shop</h3>
        {/* <p>Choose a memorable name e</p> */}
        {/* <hr></hr> */}
       <h2> {errorMsg}</h2>
        <div>
          <div className="shop_name">
            <input type="text" className="shopName" id="shopName" maxLength="20" required onChange={(event) => { setShopName(event.target.value); }} ></input>
            <button
              style={{ fontSize: "16px", display:"block", marginLeft:"40%" }}
              onClick={() => {
                CheckAvailability(shopName);
              }}
            >
              Check Shop
            </button>
          </div>
        </div>

        {createShopPage}
        {/* {isCreateShopExist ? "true" : "false"} hello {error} */}
      </div>
    </div>
  );
}

export default checkShopName;
