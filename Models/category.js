const mongoose = require('mongoose');
const connection=require("../config/connection")

const { Schema, ObjectId } = mongoose;

const CategoriesSchema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String,  }],
});

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports=Categories;

