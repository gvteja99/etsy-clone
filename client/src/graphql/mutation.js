import {
    gql,
  } from "@apollo/client";

const REGISTER = gql`
mutation register(
    $name: String!, $email: String!, $password: String!
) {
    register(
        name: $name, email: $email, password: $password
    ) {
    _id name email password fullAddress city phoneNumber dob gender profilePic about shopName shopImage 
    }
}`;

export {
    REGISTER
}