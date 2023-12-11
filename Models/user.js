const mongoose = require('mongoose');
require("../config/connection")

const { Schema, ObjectId } = mongoose;
const addressSchema=mongoose.Schema(
   {
      name: {type: String},
      address: { type: String },
      city: { type: String },
      pincode: { type: Number },
      state: { type: String },
      mobile: { type: Number },
   }
)
const imageSchema = new mongoose.Schema({
   mainimage: {
     type: String,
   },
 });
const UsersSchema = new Schema({
  userName: { type: String, required: true,},
  password: { type: String, },
  email: { type: String, required: true },
  status:{type:String},
  timeStamp:{type:Date},
  phone: { type: String },
  address: [addressSchema],
  dob: { type: String },
  joined:{type:Date},
  profile:[imageSchema],
  veified:{type:Boolean,default:false},
  wallet: {
    type: Number,
    default: 0
  },
});

const Users = mongoose.model('Users', UsersSchema);

module.exports=Users;

