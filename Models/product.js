const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;
const imageSchema = new mongoose.Schema({
  mainimage: {
    type: String,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  }
});
const ProductsSchema = new Schema({
  name: { type: String },
  images: [imageSchema],
  description: { type: String},
  stock: { type: Number },
  basePrice: { type: Number},
  descountedPrice: { type: Number},
  // variation: { type: String },
  timeStamp: { type: Date },
  brandId: { type: Schema.Types.ObjectId, ref: 'brands'  },
  categoryId: { type: Schema.Types.ObjectId,ref: 'categories' },
});

const Products = mongoose.model('products', ProductsSchema);
module.exports=Products;

