const mongoose = require("mongoose");
require("../config/connection")
const { Schema, ObjectId } = mongoose;

const OfferSchema = new Schema({
    categoryName: String,
    percentage: Number,
    expireDate: Date,
    status: {type: String, default: "Active"},
    limit: { type: Number, default: 0 },
})

const offer = mongoose.model('offer',OfferSchema)
module.exports = offer;