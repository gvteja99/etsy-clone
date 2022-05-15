import React, { useState } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { login, registerUser, activeShop } from "../features/userSlice";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  gql,
} from "@apollo/client";
import { REGISTER } from "../graphql/mutation";

function register({ setShowRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [register] = useMutation(
    REGISTER,
    {
      onCompleted(res) {
        dispatch(
          registerUser({
            username: username,
            email: email,
          })
        );
        window.location.pathname = "/home";
      },
      onError(e) {
        console.log(e);
      },
    }
  );
  const customerSignupApi = async () => {
    const body = {
      
      
    };
    console.log("body", body);
    try {
      register({
        variables: { name: username,
          email,
          password, },
      });
    } catch (err) {
      console.log(err)
    }
  }

  const addUser = (e) => {
    e.preventDefault();
    customerSignupApi();
    
  };

  return (
    <>
      <div className="bg-modal">
        <div className="modal-content">
          <div
            style={{
              marginTop: "30px",
              marginLeft: "20px",
              fontFamily: "Tahoma",
            }}
          >
          </div>
          <form className="signin_form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <br />
              <input type="email" className="email" id="email" placeholder="Enter email" onChange={(event) => { setEmail(event.target.value); }} required />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <br />
              <input type="text" className="username" id="username" placeholder="Enter username" onChange={(event) => { setUsername(event.target.value); }} required />
            </div>

            <div className="htmlForm-group">
              <label htmlFor="password">Password</label>
              <br />
              <input type="password" className="password" id="password" placeholder="Password" onChange={(event) => { setPassword(event.target.value); }} required />
            </div>
            <div className="forgot_password"></div>
            <button onClick={addUser} type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default register;
