const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  item: [{
     productId: { type: Schema.Types.ObjectId },
     quantityId: { type: Number },
  }],
});

const Cart = mongoose.model('Cart', CartSchema);

module.export=Cart;

