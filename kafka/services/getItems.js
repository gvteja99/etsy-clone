const ItemsModel = require("../models/Items");

async function handle_request(msg, callback){
    console.log("In getItems kafka handle_request");
    try{
        await ItemsModel.find({}, (err, result) => {
              callback(null, err ? err : {success: true, result});
            });
            return;
    } catch(err) {
        console.log(err);
        callback(null, 'Internal Server Error.');
        return;
      }
  };
exports.handle_request = handle_request;


