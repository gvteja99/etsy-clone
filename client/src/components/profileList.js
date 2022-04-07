import React from "react";

import cookie from "react-cookies";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import { removeAllItemsFromHome, removeFavouritesList, removeProductsState, } from "../features/productsSlice";

function profileList({ setShowProfileLists }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const showHomePage = () => {
    setShowProfileLists(false);
  };

  const loadProfilePage = () => {
    navigate("/profile"); 
  };

  const handleSellOnEtsy = () => {
    navigate("/sellonetsy");
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    console.log("In sign out");
    dispatch(logout());
    dispatch(removeProductsState());
    dispatch(removeFavouritesList());
    console.log("In sign out 1");
    cookie.remove("user", { path: "/" });
    navigate("/");
  };

  return (
    <div>
      <div onClick={showHomePage} className="profile-modal">
        <div className="profile-content">
          {/* <CloseLogin setshowSignIn={setshowSignIn} /> */}

          <ul className="profile-icons">
            <li onClick={loadProfilePage} className="profile-icon">
              <b>{cookie.load("user")}</b>
              <br />
              <span style={{ fontSize: "14px" }}>View your profile</span>
            </li>
            <li className="profile-icon">Account Settings</li>
            <li onClick={handleSellOnEtsy} className="profile-icon">
              Sell on Etsy
            </li>
            <li onClick={handleSignOut} className="profile-icon">
              Sign out
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default profileList;
