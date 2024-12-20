const CART = require("../../Models/cart");
const Orders = require("../../Models/order");
const Users = require("../../Models/user");
const sendEmail = require("../../util/mail");
const moment = require("moment");
const { AUTH_EMAIL } = process.env;
const Products = require("../../Models/product");
const { ObjectId,Types } = require("mongoose");
const razorpay = require("../../util/RazorPay");
const crypto = require('crypto');
const { updateQuantity } = require("../../helper/updateQuantity");
const { table } = require("console");
const { log } = require("console");
const Coupon = require("../../Models/coupon");
const { generateInvoice } = require("../../util/invoiceGenerator");
const Return = require("../../Models/returnSchema");
const WalletTransaction = require("../../Models/walletTransaction");



































const getOrderSuccess = async (req, res) => {
    const user = req.session.name;

    req.session.filter = false;

    const User = await Users.findOne({ _id: req.session.userid });

    if (req.session.walletbalance >= 0) {
        User.wallet = req.session.walletbalance
    }
    User.save();
    if (req.session.transactionsData) {
        await WalletTransaction.insertMany([req.session.transactionsData]);
        const usedWalletAmount = req.session.transactionsData.amount;
        const order = await Orders.findOne({ _id: new Types.ObjectId(req.session.orderId) });
        order.totalPrice = Math.round(order.totalPrice + usedWalletAmount);
        order.save();
    }

    const couponId = req.session.couponid
    const couponmatch = await Coupon.findOne({ _id: couponId });
    console.log(couponmatch);
    if (couponmatch) {
        couponmatch.usedBy.push({
            userId: req.session.userid,
            usedAt: new Date(),
        });
        await couponmatch.save();
    }
    req.session.checkout = false;
    res.render("./User/OrderSuccess", { user, cartCount: req.session.cartCount });
}
//place order
const placeOrder = async (req, res) => {
    try {
        console.log("inside body", req.body);
        const userId = req.session.userid;
        const username = req.session.name
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
        console.log("safvan", cart.products);

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
        const currentDate = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
        });
        const newOrders = new Orders({
            userId: userId,
            items: cart.products,
            // orderDate: moment(new Date()).format("llll"),
            orderDate: currentDate,
            expectedDeliveryDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
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

        if (paymentMethod === "cod" || paymentMethod === "wallet") {
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
                            <p><strong>Total Amount:</strong> ${order.totalPrice.toLocaleString()}</p>
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
            res.json({ success: true, cartCount: 0 });
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
                    res.json({ createdOrder, order, cartCount: 0 });
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
        const orders = await Orders.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "itemsDetails"
                }
            },
            {
                $unwind: "$itemsDetails"
            },
            {
                $addFields: {
                    "itemsDetails.quantity": {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: "$items",
                                    as: "item",
                                    in: {
                                        $cond: {
                                            if: { $eq: ["$$item.productId", "$itemsDetails._id"] },
                                            then: "$$item.quantity",
                                            else: 0
                                        }
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    status: { $first: "$status" },
                    itemsDetails: { $push: "$itemsDetails" },
                    payMethod: { $first: "$payMethod" },
                    orderDate: { $first: "$orderDate" },
                    totalPrice: { $first: "$totalPrice" },
                    expectedDeliveryDate: { $first: "$expectedDeliveryDate" },
                    paymentStatus: { $first: "$paymentStatus" },
                    address: { $first: "$address" }
                }
            },
            {
                $sort: {
                    _id: -1,
                },
            },

        ]);
        // console.log("hellllllllllllllllllllllllllll",orders.items)
        log('Orders:', orders);
        if (orders.length === 0) {
            return res.render('./User/orderHistory', { user, orders: [], cartCount: req.session.cartCount });
        } else {
            res.render('./User/orderHistory', {
                user,
                orders: orders,
                cartCount: req.session.cartCount
            });
        }
    } catch (error) {
        console.log("error in track order", error);
        // res.render('error/404')
    }
}

//order detail page😀

const getOrderDetails = async (req, res) => {
    try {
        const user = req.session.name
        const orderId = req.params.orderId;
        const userId = req.session.userid;
        const orders = await Orders.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    _id: new Types.ObjectId(orderId)
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "itemsDetails"
                }
            },
            {
                $unwind: "$itemsDetails"
            },
            {
                $addFields: {
                    "itemsDetails.quantity": {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: "$items",
                                    as: "item",
                                    in: {
                                        $cond: {
                                            if: { $eq: ["$$item.productId", "$itemsDetails._id"] },
                                            then: "$$item.quantity",
                                            else: 0
                                        }
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    status: { $first: "$status" },
                    itemsDetails: { $push: "$itemsDetails" },
                    payMethod: { $first: "$payMethod" },
                    orderDate: { $first: "$orderDate" },
                    totalPrice: { $first: "$totalPrice" },
                    expectedDeliveryDate: { $first: "$expectedDeliveryDate" },
                    paymentStatus: { $first: "$paymentStatus" },
                    address: { $first: "$address" },
                    returnDate: { $first: "$returnDate" }

                }
            },

        ]);
        log("Orders", orders[0])
        orders[0].itemsDetails.forEach((item) => {
            log("helloo")
        })
        table(orders)
        if (orders.length === 0) {
            throw err("no details avilabnle at the momment")
        } else {
            res.render('./User/orderDetials', {
                user,
                order: orders[0],
                cartCount: req.session.cartCount
            });
        }
    } catch (err) {
        console.log(err)
        req.session.err = true;
        res.redirect("/404");
    }
}

//cancel order
const cancelorder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const User = await Users.findOne({ email: req.session.email })
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
            if (order.payMethod === "online") {
                User.wallet += order.totalPrice
            }
            const transactionData = {
                user: new Types.ObjectId(req.session.userid),
                amount: order.totalPrice,
                description: "Canceled Order",
                transactionType: 'credit',
            }
            const insert = await WalletTransaction.insertMany([transactionData]);
            await order.save();
            await User.save();

            return res.redirect("/order-history");
        } else {
            console.log("Order cannot be cancelled");
        }
    } catch (error) {
        console.error("Error cancelling the order:", error);
        res.render('error/404');
    }
};


//verify paymment
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
            const orderId = new Types.ObjectId(
                req.body.order.createdOrder.receipt
            );
            console.log("reciept", req.body.order.createdOrder.receipt);
            const Order = await Orders.findOne({ _id: new Types.ObjectId(orderId) });
            Order.paymentStatus = "Paid";
            Order.payMethod = "online";
            Order.save()
            // console.log("hmac success");
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
                        <p>Dear ${req.session.name},</p>
                        <p>Thank you for your order. We're processing it and will notify you once it's shipped.</p>
                
                        <div class="order-details">
                            <h2>Order Details</h2>
                            <p><strong>Order ID:</strong> ${Order._id}</p>
                            <p><strong>Order Date:</strong> ${Order.orderDate}</p>
                            <p><strong>Total Amount:</strong> ${Order.totalPrice.toLocaleString()}</p>
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
        } else {
            // console.log("hmac failed");
            res.json({ failure: true });
        }

    } catch (error) {
        console.error("failed to verify the payment", error);
    }
}


//generate invoice
const generateInvoices = async (req, res) => {
    try {
        const { orderId } = req.body;

        const orderDetails = await Orders.findOne({ _id: orderId })
            .populate("items.productId");

        const ordersId = orderDetails._id;

        console.log(ordersId);

        if (orderDetails) {
            const invoicePath = await generateInvoice(orderDetails);

            res.json({
                success: true,
                message: "Invoice generated successfully",
                invoicePath,
            });
        } else {
            res
                .status(500)
                .json({ success: false, message: "Failed to generate the invoice" });
        }
    } catch (error) {
        console.error("error in invoice downloading", error);
        res
            .status(500)
            .json({ success: false, message: "Error in generating the invoice" });
    }
};

//download invoice
const downloadInvoice = async (req, res) => {
    try {
        const id = req.params.orderId;
        const filePath = `public/pdf/${id}.pdf`;
        res.download(filePath, `invoice.pdf`);
    } catch (error) {
        console.error("Error in downloading the invoice:", error);
        res
            .status(500)
            .json({ success: false, message: "Error in downloading the invoice" });
    }
};

// const returnProduct = async (req, res) => {
//     try {
//         const { orderId, productId, quantity, reason } = req.body;
//         const existingRequest = await Return.find({ _id: new Types.ObjectId(orderId) })
//         console.log("heeeeeeeeeeeee",existingRequest);
//         if (existingRequest.length > 0) {
//             res.status(200).json({
//                 success: false,
//                 msg:"Request already sented"
//             });
//         } else {
//             const product = await Products.findOne({ _id: new Types.ObjectId(productId) });
//             const order = await Orders.findOne({ _id: new Types.ObjectId(orderId) });
//             if (product && order) {
//                 const totalPrice = product.descountedPrice * quantity;
//                 const data = {
//                     orderId: orderId,
//                     productId: productId,
//                     quantity: quantity,
//                     description: reason,
//                     totalPrice: totalPrice
//                 }
//                 await Return.insertMany([data])

//                 res.status(200).json({
//                     success: true,
//                 });
//             } else {
//                 res.status(500).json({ success: false, message: "Error in returning " });
//             }
//         }
//     }
//     catch (error) {
//         console.error("error in invoice downloading", error);
//         res
//             .status(500)
//             .json({ success: false, message: "Error in generating the invoice" });
//     }
// };
const returnOrder = async (req, res) => {
    try {
        const { orderId, totalPrice, reason } = req.body;
        const existingRequest = await Return.find({ orderId: new Types.ObjectId(orderId) })
        console.log("heeeeeeeeeeeee",existingRequest);
        if (existingRequest.length > 0) {
            res.status(200).json({
                success: false,
                msg:"Request already sented"
            });
        } else {
        const order = await Orders.findOne({ _id: new Types.ObjectId(orderId) });
        if (order) {

            const data = {
                orderId: orderId,
                description: reason,
                totalPrice: totalPrice
            }
            await Return.insertMany([data])

            res.status(200).json({
                success: true,
            });
        } else {
            res.status(500).json({ success: false, message: "Error in generating the invoice" });
        }
    }
    }
    catch (error) {
        console.error("error in invoice downloading", error);
        res
            .status(500)
            .json({ success: false, message: "Error in generating the invoice" });
    }
}
module.exports = {
    orderHistory,
    getOrderSuccess,
    placeOrder,
    cancelorder,
    verifypayment,
    getOrderDetails,
    generateInvoices,
    downloadInvoice,
    // returnProduct,
    returnOrder
}