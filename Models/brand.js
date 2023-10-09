const mongoose = require('mongoose');
const connection=require("../config/connection")

const { Schema, ObjectId } = mongoose;

const BrandsSchema = new Schema({
  name: { type: String },
  images: { type: String },
});

const Brands = mongoose.model('Brands', BrandsSchema);

module.exports=Brands;

