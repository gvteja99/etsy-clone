import {
    gql,
  } from "@apollo/client";


const GET_ITEM_LIST = gql`
query{ getItemsList {
    _id userId itemName itemCategory itemPrice itemDescription itemCount itemImage 
  }
}
`; 

const GET_SHOP_NAME = gql`
query getShopById($userId : String) {
  getShopById(userId : $userId){
  _id name email password fullAddress city phoneNumber dob gender profilePic about shopName shopImage
}
}
`; 

const GET_PURCHASES = gql`
query getPurchases($userId : String) {
  getPurchases(userId : $userId){
    _id  itemId{_id userId itemName itemCategory itemPrice itemDescription itemCount itemImage} userId orderId qty purchase gift 
  }
}
`; 

const GET_CART = gql`
query getPurchases($userId : String) {
  getPurchases(userId : $userId){
    _id  itemId{_id userId itemName itemCategory itemPrice itemDescription itemCount itemImage} userId orderId qty purchase gift 
  }
}
`; 


export {
    GET_ITEM_LIST,
    GET_SHOP_NAME,
    GET_PURCHASES,
    GET_CART
}