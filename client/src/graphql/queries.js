import {
    gql,
  } from "@apollo/client";


const GET_ITEM_LIST = gql`
query{ getItemsList {
    _id userId itemName itemCategory itemDescription itemCount itemImage 
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
}