const mongoose = require('mongoose');
const connection=require("../config/connection")
// const { Schema, ObjectId } = mongoose;

const SuperAdminSchema = mongoose.Schema({
  email:  String ,
  userName: String ,
  password: String ,
});

const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

module.exports=SuperAdmin;

