import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import Register from "./register";
import CloseLogin from "./closeLogin";
import { Navigate, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { useDispatch } from "react-redux";
import { login, activeUser, activeShop } from "../features/userSlice";

function Signin({ setshowSignIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);

  const dispatch = useDispatch();

  const handleRegister = () => {
    setShowRegister(true);
  };

  Axios.defaults.withCredentials = true;
  //sends cookies; withCredentials indicates whether or not cross-site Access-Control requests should be made using credentials

  const checkUser = (e) => {
    e.preventDefault();

    console.log("Hi")

    Axios.post("http://localhost:4000/signin", { email: email, password: password, })
      .then((response) => {
        console.log("bleh", response.data.length)
        //if (response.data.length === 1) {
          console.log(response);
          console.log(response.data[0]);
          console.log("In frontend signin");
          console.log(response.data.result[0]._id);
          localStorage.setItem("token", response.data.token);

          dispatch(
            login({
              id: response.data.result[0]._id,
              email: response.data.result[0].email,
              name: response.data.result[0].name,
              shopName: response.data.result[0].shopName,
              dob: response.data.result[0].dob,
              gender: response.data.result[0].gender,
              city: response.data.result[0].city,
              phoneNumber: response.data.result[0].phoneNumber,
              profilePic: response.data.result[0].profilePic,
              about: response.data.result[0].about,
              shopImage: response.data.result[0].shopImage,
              loggedIn: true,
            })
          );

          window.location.pathname = "/home";
        // } else {
        //   setError("Invalid Credentials!");
        // }
      })
      .catch((err) => {
        console.log("error")
        console.log(err)
        setError("Invalid credentials");
      });
  };

  useEffect(() => {
    Axios.get("http://localhost:4000/signin").then((response) => {

      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0]);
        console.log(loginStatus);
        console.log("++++++++++ cookie ++++++++++++" + cookie.load("user"));
      }
    });
  }, []);


  return (
    <>
      <div className="bg-modal">
        <div className="modal-content">
          <CloseLogin setshowSignIn={setshowSignIn} />
          <form className="signin_form">
            <span style={{ color: "red" }}>{error}</span>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <br />
              <input type="email" className="email" id="email" placeholder="Enter email" onChange={(event) => { setEmail(event.target.value); }} required />
            </div>

            <div className="htmlForm-group">
              <label htmlFor="password">Password</label>
              <br />
              <input type="password" className="password" id="password" placeholder="Password" onChange={(event) => { setPassword(event.target.value); }} required />
            </div>
          
            <button onClick={checkUser} type="submit" className="btn btn-primary" > Sign In </button>
            <button onClick={handleRegister} className="register-btn btn-primary" > Register </button>
          </form>
        </div>
        {showRegister === true && ( <Register setShowRegister={setShowRegister} /> )}
      </div>
    </>
  );
}

export default Signin;
