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
  status: { type: String },
  timeStamp: { type: Date },
  brandId: { type: Schema.Types.ObjectId, ref: 'brands'  },
  categoryId: { type: Schema.Types.ObjectId,ref: 'categories' },
  IsInCategoryOffer :{ type:Boolean, default: false},
  categoryOffer: {offerPercentage: { type: Number }},  
  beforeOffer:{ type: Number },
});

const Products = mongoose.model('products', ProductsSchema);
module.exports=Products;

