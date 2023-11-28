const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const ReturnSchema = new Schema({
  orderId: {type: Schema.Types.ObjectId, ref: 'Orders' },
  // productId:{type: Schema.Types.ObjectId, ref: 'products'},
  // quantity:{type:Number},
  description: { type: String},
  totalPrice: { type: Number },
});

const Return = mongoose.model('return', ReturnSchema);
module.exports=Return;

