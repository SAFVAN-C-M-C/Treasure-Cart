const mongoose = require('mongoose');
const connection=require("../config/connection")

const { Schema, ObjectId } = mongoose;

const OrdersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  status: { type: String, default:"Order Placed"},
  items: [{
     productId: { type: Schema.Types.ObjectId , ref: "products" },
     quantity: { type: Number },
  }],
  payMethod: {type: String},
  orederDate: { type: String },
  totalPrice: { type: Number },
  PaymentStatus: {type: String, default: "Pending"},
  couponId: { type: Schema.Types.ObjectId },
  address: { type: Schema.Types.ObjectId , ref :'User' },
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders
