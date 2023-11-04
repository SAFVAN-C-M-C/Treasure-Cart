const CART = require("../../Models/cart");
const Orders = require("../../Models/order");
const Users = require("../../Models/user");
const sendEmail = require("../../util/mail");
const moment = require("moment");
const {AUTH_EMAIL}=process.env;
const Products = require("../../Models/product");
const { ObjectId } = require('mongodb')





































const getOrderSuccess=(req,res)=>{
    const user =req.session.name;
    res.render("./User/OrderSuccess",{user});
}
//place order
const placeOrder = async (req, res) => {
    try {
        console.log("inside body", req.body);
        const userId = req.session.userid;
        const amount = req.session.totalAmount;
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",typeof amount);
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
          const Address_distruct={
            name:address.address[0].name,
            address:address.address[0].address,
            city:address.address[0].city,
            pincode:address.address[0].pincode,
            state:address.address[0].state,
            mobile:address.address[0].mobile,
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

        //delete the items in the cart after checkout
        await CART.findByIdAndDelete(cart._id);

        const order = await newOrders.save();
        console.log(order, "in orders");
        req.session.orderId = order._id;

        // Updating the stock quantity
        for (const item of order.items) {
            const productId = item.productId;
            const quantity = item.quantity;
            const product = await Products.findById(productId);

            if (product) {
                const updatedQuantity = product.stock - quantity;
                if (updatedQuantity < 0) {
                    product.stock = 0;
                } else {
                    product.stock = updatedQuantity;
                }
                await product.save();
                console.log("stock updated")
            }
        }
        if (paymentMethod === "cod") {
            console.log("cod section");
            //send email with details of orders
            const mailOptions = {
                from: AUTH_EMAIL,
                to: req.session.email,
                subject: "Your Orders!",
                html:`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Confirmation</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #fff;
                            padding: 20px;
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
                            border-top: 1px solid #ddd;
                            padding-top: 10px;
                        }
                
                        .footer {
                            margin-top: 20px;
                            color: #888;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Order Confirmation</h1>
                        <p>Dear [Customer Name],</p>
                        <p>Thank you for your order. We are currently processing it and will notify you once it has been shipped.</p>
                
                        <div class="order-details">
                            <h2>Order Details</h2>
                            <!-- Include order details here, such as itemized list, total, etc. -->
                        </div>
                
                        <p class="footer">If you have any questions, please contact our customer support at support@example.com.</p>
                    </div>
                </body>
                </html>`
            }
            await sendEmail(mailOptions);
            console.log("order email sended");
            res.json({ success: true });
        }
    } catch (err) {
        console.log(err);
    }
}
//order history
const orderHistory=async(req,res)=>{
    try {
        const userId=req.session.userid
        const user=req.session.name
        const orders = await Orders.find({ userId: userId })
        .sort({ orderDate: -1 })
        .populate(
            'items.productId'
        );
    // console.log("hellllllllllllllllllllllllllll",orders.items)
        // console.log('Orders:', orders);
        if (orders.length === 0) {
            return res.render('./User/orderHistory', { user ,orders:[]});
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
        return res.redirect("/user/order-history");
      } else {
        console.log("Order cannot be cancelled");
      }
    } catch (error) {
      console.error("Error cancelling the order:", error);
      res.render('error/404');
    }
  };
module.exports={
    orderHistory,
    getOrderSuccess,
    placeOrder,
    cancelorder
}