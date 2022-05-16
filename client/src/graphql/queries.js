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




// const GET_ITEM_LIST = gql`
// query getCustomerProfile($id: ID!) {
//   getCustomerProfile(id: $id) {
//     _id first_name last_name email password phone_number dob nickname profile_pic about token
//     address { street_address apt_number city state country zipcode }
//   }
// }
// `; 

export {
    GET_ITEM_LIST,
    GET_SHOP_NAME,
    GET_PURCHASES
}