const mongoose = require('mongoose');
const connection=require("../config/connection")

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },}
  ],
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
 