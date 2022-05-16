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

const CREATESHOP = gql`
mutation createShop(
    $shopName: String!, $id: String!
) {
    createShop(

        shopName: $shopName, id: $id
    ) {
    _id name email password fullAddress city phoneNumber dob gender profilePic about shopName shopImage 
    }
}`;

const ADDCART = gql`
mutation addcart(
    $userId: String, $itemId: String , $qty: Int
) {
    addcart(
        userId: $userId, itemId: $itemId , qty: $qty,
    ) {
    _id itemId userId orderId qty purchase gift 
    }
}`;


export {
    REGISTER,
    CREATESHOP,
    ADDCART
}