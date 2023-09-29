const mongoose = require('mongoose');
const connection=require("../config/connection")
// const { Schema, ObjectId } = mongoose;

const SuperAdminSchema = mongoose.Schema({
  Email:  String ,
  UserName: String ,
  Password: String ,
});

const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

module.exports=SuperAdmin;

