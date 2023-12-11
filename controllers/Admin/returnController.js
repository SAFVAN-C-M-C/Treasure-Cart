const { ObjectId } = require("mongodb");
const { cropImage } = require("../../util/cropImages");
const Orders = require("../../Models/order");
const Return = require("../../Models/returnSchema");
const Users = require("../../Models/user");
const WalletTransaction = require("../../Models/walletTransaction");
const { AUTH_EMAIL } = process.env;
const sendEmail = require("../../util/mail");



const getReqreturn=async(req,res)=>{
    try {
        const pageNum = req.query.page?req.query.page:1;
      // console.log(pageNum);
      const perPage = 10;
      const totalorder=await Return.countDocuments()

      const data = await Return.aggregate([
        {
          $skip: (pageNum - 1) * perPage,
        },
        {
          $limit: perPage,
        },
      ]);

      let x = Number((pageNum - 1) * perPage);
      var count=Math.floor(totalorder/10)+1;
      res.render("./Admin/Returnrequests",{reqs:data,count:count,x});
        const reqs=await Return.find();
        res.render
    } catch (error) {
        console.log(error);
    }
}

const acceptRequest=async(req,res)=>{
  try{
    const {reqId}=req.body;
    
    const reqs=await Return.findOne({_id:new ObjectId(reqId)});
    console.log(reqs);
    const order=await Orders.findOne({_id:new ObjectId(reqs.orderId)});
    const total=order.totalPrice
    const User = await Users.findOne({_id:new ObjectId(order.userId)});
    order.status="Returned";
    order.save()
    User.wallet+=total;

    const transactionData={
      user:new ObjectId(order.userId),
      amount:total,
      description:"Returned Order",
      transactionType:'credit',
  }
  const insert=await WalletTransaction.insertMany([transactionData]);
    User.save();
    reqs.status="Accepted";
    reqs.save();
    res.status(200).json({success:true});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"somithing went wrong"})
  }
}
const rejectRequest=async(req,res)=>{
  try {
    const {reqId}=req.body;
    const reqs=await Return.findOne({_id:new ObjectId(reqId)})
    reqs.status="Rejected";
    reqs.save();
    const Order=await Orders.findOne({_id:new ObjectId(reqs.orderId)}).populate("userId");
    const userEmail=Order.userId.email;
    const mailOptions = {
      from: AUTH_EMAIL,
      to: userEmail,
      subject: "Return Request Update",
      html: `<!DOCTYPE html>
      <html lang="en">
  
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Return Request Update</title>
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
  
              .rejection-details {
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
              <h1>Return Request Update</h1>
              <p>Dear ${Order.userId.userName},</p>
              <p>We regret to inform you that your return request for Order ID ${Order._id} has been rejected.</p>
  
              
  
              <div class="footer">
                  <p>We apologize for any inconvenience caused. If you have further questions, please contact us at <a href="mailto:treasurecart05@gmail.com">treasurecart05@gmail.com</a></p>
                  <p>Thank you for your understanding.</p>
              </div>
          </div>
  
      </body>
  
      </html>`
  }
  await sendEmail(mailOptions);
  console.log("Rejection email sended");
    res.status(200).json({success:true});
  } catch (err) {
    console.log(err);
    res.status(500).json({error:"somithing went wrong"})
  }
}
module.exports={
    getReqreturn,
    acceptRequest,
    rejectRequest
}
