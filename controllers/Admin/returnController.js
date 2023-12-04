const { ObjectId } = require("mongodb");

const Orders = require("../../Models/order");
const Return = require("../../Models/returnSchema");
const Users = require("../../Models/user");
const WalletTransaction = require("../../Models/walletTransaction");
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
    await Return.deleteOne({_id:reqId})
    res.status(200).json({success:true});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"somithing went wrong"})
  }
}
module.exports={
    getReqreturn,
    acceptRequest
}
