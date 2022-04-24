const FavouritesModel = require("../models/Favourites");

async function handle_request(req, callback) {
    const userId = req.body.userId;
    console.log(userId);
    const itemId = req.body.itemId;
    const newFav = new FavouritesModel({
      itemId: itemId, userId: userId
    });
    await newFav.save({}, (err, result) => {
        if (err) {
          console.log("err", err);
          //res.json(err);
          callback(null, { status_code: 500, response: { msg: err} });
    return;
        } else {
          console.log(result);
          //res.send({ success: true, result });
          callback(null, {status_code: 200, response: {msg: "Successful", success: true, result: result} })

          return;
        }
      })
}
exports.handle_request = handle_request;
