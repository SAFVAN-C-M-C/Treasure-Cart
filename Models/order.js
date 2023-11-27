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
const ReturnRequestSchema = new Schema({
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const OrdersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  status: { type: String, default:"Order Placed"},
  items: [{
     productId: { type: Schema.Types.ObjectId , ref: "products" },
     quantity: { type: Number },
  }],
  payMethod: {type: String,default:"Online"},
  orderDate: { type: Date },
  totalPrice: { type: Number },
  expectedDeliveryDate:{type: Date},
  paymentStatus: {type: String, default: "Pending"},
  couponId: { type: Schema.Types.ObjectId },
  address: {type:address_schema  },
  returnRequest: { type: ReturnRequestSchema },
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders
