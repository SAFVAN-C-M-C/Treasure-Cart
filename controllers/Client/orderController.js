const CART = require("../../Models/cart");
const Orders = require("../../Models/order");
const Users = require("../../Models/user");
const sendEmail = require("../../util/mail");
const moment = require("moment");
const { AUTH_EMAIL } = process.env;
const Products = require("../../Models/product");
const { ObjectId } = require('mongodb')
const razorpay = require("../../util/RazorPay");
const crypto = require('crypto');
const { updateQuantity } = require("../../helper/updateQuantity");




































const getOrderSuccess = (req, res) => {
    const user = req.session.name;
    res.render("./User/OrderSuccess", { user });
}
//place order
const placeOrder = async (req, res) => {
    try {
        console.log("inside body", req.body);
        const userId = req.session.userid;
        const username=req.session.name
        const amount = req.session.totalAmount;
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",typeof amount);
        const user = await Users.findById(userId);
        const {
            Address,
            paymentMethod
        } = req.body

        const cart = await CART.findOne({ userId: userId }).populate(
            "products.productId"
        );
        // console.log(cart.products);

        const address = await Users.findOne(
            { _id: userId },
            { address: { $elemMatch: { _id: Address } } }
        )
        //   console.log("addddddddreeeeeeeeeeeeeeeesssssssssssssssss",address);
        const Address_distruct = {
            name: address.address[0].name,
            address: address.address[0].address,
            city: address.address[0].city,
            pincode: address.address[0].pincode,
            state: address.address[0].state,
            mobile: address.address[0].mobile,
        }

        const newOrders = new Orders({
            userId: userId,
            items: cart.products,
            orderDate: moment(new Date()).format("llll"),
            expectedDeliveryDate: moment().add(7, "days").format("llll"),
            totalPrice: amount.toFixed(2),
            address: Address_distruct,
            payMethod: paymentMethod,
        });


        req.session.cartId = cart._id


        const order = await newOrders.save();
        console.log(order, "in orders");
        req.session.orderId = order._id;
        req.session.items = order.items;
        // Updating the stock quantity

        if (paymentMethod === "cod") {
            console.log("cod section");
            //send email with details of orders
            const mailOptions = {
                from: AUTH_EMAIL,
                to: req.session.email,
                subject: "Your Orders!",
                html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Confirmation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                
                        h1 {
                            color: #333;
                        }
                
                        p {
                            color: #555;
                        }
                
                        .order-details {
                            margin-top: 20px;
                            border-top: 2px solid #ddd;
                            padding-top: 10px;
                        }
                
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            color: #888;
                        }
                
                        .logo {
                            display: flex;
                            justify-content: center;
                            width: 100%;
                        }
                
                        .logo img {
                            width: 200px;
                            height: auto;
                        }
                    </style>
                </head>
                
                <body>
                
                    <div class="container">
                        <div class="logo">
                            <img src="http://localhost:7000/static/images/logo.png" alt="img">
                        </div>
                        <h1>Order Confirmation</h1>
                        <p>Dear ${username},</p>
                        <p>Thank you for your order. We're processing it and will notify you once it's shipped.</p>
                
                        <div class="order-details">
                            <h2>Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${order.orderDate}</p>
                            <p><strong>Total Amount:</strong> ${order.totalPrice}</p>
                        </div>
                
                        <div class="footer">
                            <p>Thank you for choosing Treasure Cart!</p>
                            <p>For any queries contact <a href="mailto:
                                        treasurecart05@gmail.com">
                                    treasurecart05@gmail.com</a></p>
                        </div>
                    </div>
                
                </body>
                
                </html>`
            }
            await sendEmail(mailOptions);
            console.log("order email sended");
            updateQuantity(req.session.items, req.session.cartId)
            res.json({ success: true });
        }
        else {
            const order = {
                amount: amount,
                currency: "INR",
                receipt: req.session.orderId,
            };
            await razorpay
                .createRazorpayOrder(order)
                .then((createdOrder) => {
                    console.log("payment response", createdOrder);
                    res.json({ createdOrder, order });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    } catch (err) {
        console.log(err);
    }
}
//order history
const orderHistory = async (req, res) => {
    try {
        const userId = req.session.userid
        const user = req.session.name
        const orders = await Orders.find({ userId: userId })
            .sort({ orderDate: -1 })
            .populate(
                'items.productId'
            );
        // console.log("hellllllllllllllllllllllllllll",orders.items)
        // console.log('Orders:', orders);
        if (orders.length === 0) {
            return res.render('./User/orderHistory', { user, orders: [] });
        } else {
            res.render('./User/orderHistory', {
                user,
                orders: orders
            });
        }
    } catch (error) {
        console.log("error in track order");
        res.render('error/404')
    }
}
//cancel order
const cancelorder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Orders.findById(orderId);

        if (!order) {
            console.log('Order not found');
        }

        if (order.status === "Order Placed") {
            const productsToUpdate = order.items;
            for (const product of productsToUpdate) {
                const cancelProduct = await Products.findById(product.productId);

                if (cancelProduct) {
                    cancelProduct.AvailableQuantity += product.quantity;
                    await cancelProduct.save();
                }
            }
            order.status = "Cancelled";
            await order.save();
            return res.redirect("/order-history");
        } else {
            console.log("Order cannot be cancelled");
        }
    } catch (error) {
        console.error("Error cancelling the order:", error);
        res.render('error/404');
    }
};


//verufy paymment
const verifypayment = async (req, res) => {
    try {

        let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
        console.log(
            req.body.payment.razorpay_order_id +
            "|" +
            req.body.payment.razorpay_payment_id
        );
        hmac.update(
            req.body.payment.razorpay_order_id +
            "|" +
            req.body.payment.razorpay_payment_id
        );

        hmac = hmac.digest("hex");
        if (hmac === req.body.payment.razorpay_signature) {
            const orderId = new ObjectId(
                req.body.order.createdOrder.receipt
            );
            console.log("reciept", req.body.order.createdOrder.receipt);
            const updateOrderDocument = await Orders.findByIdAndUpdate(orderId, {
                paymentStatus: "Paid",
                paymentMethod: "Online",
            });
            // console.log("hmac success");
            updateQuantity(req.session.items, req.session.cartId)
            res.json({ success: true });
        } else {
            // console.log("hmac failed");
            res.json({ failure: true });
        }

    } catch (error) {
        console.error("failed to verify the payment", error);
    }
}

module.exports = {
    orderHistory,
    getOrderSuccess,
    placeOrder,
    cancelorder,
    verifypayment
}