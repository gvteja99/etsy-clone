const CartModel = require("../models/Cart");

function handle_request(req, callback) {
    const id = req.params.id;
    console.log("id",id)
    let uniqueOrderId = Math.floor(Math.random() * 1000000);
    CartModel.updateMany({ userId: id , purchase: 0}, { $set: {orderId: uniqueOrderId, purchase: 1 } }, (err, result) => {
        if (err) {
          console.log("err", err);
          callback(null, { status_code: 500, response: { msg: err} });
          return;
        } else {
          console.log("resultbleh", result);
          //res.send({ success: true, result });
          callback(null, {status_code: 200, response: {msg: "Successful", success: true} })
          return;
        }
      })}


exports.handle_request = handle_request;
