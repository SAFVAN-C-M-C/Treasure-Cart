const mongoose = require('mongoose');
const connection=require("../config/connection")

const { Schema, ObjectId } = mongoose;

const UsersSchema = new Schema({
  UserName: { type: String, required: true,  },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String },
  Status: { type: String },
  Address: [{
     AddressLine: { type: String },
     Country: { type: String },
     Pincode: { type: String },
     State: { type: String },
  }],
  Orders: [{
     OrderId: { type: Schema.Types.ObjectId },
  }],
  Dob: { type: Date },
  Gender: { type: String },
});

const Users = mongoose.model('Users', UsersSchema);

module.exports=Users;

