const razorPay = require("razorpay")
require("dotenv").config();
module.exports = {
    createRazorpayOrder: (order) => {
        console.log(order);
        return new Promise((resolve, reject) => {
            const razorpay = new razorPay({
                key_id: process.env.KEY_ID,
                key_secret: process.env.KEY_SECRET
            });
            const razorpayOrder = razorpay.orders.create({
                amount: order.amount * 100,
                currency: 'INR',
                receipt: order.receipt,
            });
            resolve(razorpayOrder);
        })
    }
};