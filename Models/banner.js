const mongoose = require('mongoose');
require("../config/connection")

const { Schema, ObjectId } = mongoose;
const bannerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    status:{
        type:String
    },
    timeStamp: {
        type: Date
    },
});

const Banner = mongoose.model('banner', bannerSchema);

module.exports = Banner;

