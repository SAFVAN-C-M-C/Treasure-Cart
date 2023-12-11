const mongoose = require('mongoose');
const connection=require("../config/connection")

const { Schema, ObjectId } = mongoose;

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  products: [{
     productId: { type: Schema.Types.ObjectId, ref: 'products' },
     quantity: { type: Number },
     unitPrice:{type:Number}
  }],
});

const CART = mongoose.model('cart', CartSchema);

module.exports=CART;

