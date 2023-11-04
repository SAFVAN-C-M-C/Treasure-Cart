const mongoose = require('mongoose');
const connection=require("../config/connection")

const { Schema, ObjectId } = mongoose;
const address_schema=new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    mobile: { type: Number, required: true },

})
const OrdersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  status: { type: String, default:"Order Placed"},
  items: [{
     productId: { type: Schema.Types.ObjectId , ref: "products" },
     quantity: { type: Number },
  }],
  payMethod: {type: String},
  orderDate: { type: String },
  totalPrice: { type: Number },
  expectedDeliveryDate:{type: String},
  paymentStatus: {type: String, default: "Pending"},
  // couponId: { type: Schema.Types.ObjectId },
  address: {type:address_schema  },
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders
