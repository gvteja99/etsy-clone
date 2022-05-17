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

const ADDITEM = gql`
mutation additem(
    $userId: String!, $itemName: String,$itemCategory: String,$itemDescription: String,$itemPrice: Int,$itemImageurl: String
) {
    addproduct(

        userId: $userId, itemName: $itemName,itemCategory: $itemCategory,itemDescription: $itemDescription,itemPrice: $itemPrice,itemImageurl: $itemImageurl
    ) {
    _id userId itemName itemCategory itemDescription itemPrice itemImageurl 
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

const UPDATEQTY = gql`
mutation updateqty(
    $cartId: String, $qty: Int
) {
    updateqty(
        cartId: $cartId, qty: $qty
    ) {
    _id itemId userId orderId qty purchase gift 
    }
}`;

const UPDATEGIFT = gql`
mutation updategift(
    $cartId: String, $gift: String
) {
    updategift(
        cartId: $cartId, gift: $gift
    ) {
    _id itemId userId orderId qty purchase gift 
    }
}`;


export {
    REGISTER,
    CREATESHOP,
    ADDCART,
    ADDITEM,
    UPDATEQTY,
    UPDATEGIFT

}