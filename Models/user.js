const mongoose = require('mongoose');
const connection=require("../config/connection")

const { Schema, ObjectId } = mongoose;
const addressSchema=mongoose.Schema(
   {
      addressLine: { type: String },
      country: { type: String },
      pincode: { type: String },
      state: { type: String },
   }
)
const UsersSchema = new Schema({
  userName: { type: String, required: true,},
  password: { type: String, },
  email: { type: String, required: true },
  status:{type:String},
  timeStamp:{type:Date},
  phone: { type: String },
  address: [addressSchema],
  orders: [{
     orderId: { type: Schema.Types.ObjectId },
  }],
  dob: { type: Date },
  gender: { type: String },
  joined:{type:Date},
  profile:{type:String},
  veified:{type:String}
});

const Users = mongoose.model('Users', UsersSchema);

module.exports=Users;

