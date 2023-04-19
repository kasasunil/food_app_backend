const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
    {
        name: String,
        email: String,
        cartItems:[String],
        favoriteItems:[String],
    },
    { timestamps: true }
);
const UserModel = mongoose.model("UserData", Schema);
module.exports = UserModel;