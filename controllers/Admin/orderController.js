const Orders = require("../../Models/order");
const report=require("../../util/SalesReport")
const {log}=require ("console")
const moment = require("moment");

const getOrders = async (req, res) => {
    try {
        const pageNum = req.query.page ? req.query.page : 1;
        const perPage = 10;
        // const orders = await Orders.find().populate(
        //     "items.productId"
        // ).skip((pageNum - 1) * perPage)
        //     .limit(perPage);
        const totalorder=await Orders.countDocuments()
        console.log("totalorder",totalorder);
        const orders = await Orders.aggregate([
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
            {
                $skip: (pageNum - 1) * perPage
            },
            {
                $limit: perPage
            }
        ]);
        let x = Number((pageNum - 1) * perPage);
        var count = Math.floor(totalorder/ 10) + 1;
        res.render("./Admin/orders", { orders: orders, count: count, x });
    } catch (error) {
        console.log(error);
    }
}
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const newStatus = req.body.status;
        if(newStatus==="Delivered"){
            await Orders.findByIdAndUpdate(orderId, { status: newStatus,paymentStatus:"Paid" });
        }
        await Orders.findByIdAndUpdate(orderId, { status: newStatus });
        res.json({ success: true });
    } catch (error) {

        console.error('Error updating order status:', error);
        res.json({ success: false });
    }
}
//generate sales report in pdf
const genereatesalesReport = async (req, res) => {
    try {
     log("body",req.body);
     const startDate = new Date(req.body.startDate);
     startDate.setHours(0, 0, 0, 0);
     const format = req.body.downloadFormat;
     const endDate = new Date(req.body.endDate);
     endDate.setHours(23, 59, 59, 999);
     
 log("starting",startDate);
 log("ending",endDate)
     const orders = await Orders.find({
       paymentStatus: "Paid",
       orderDate: {
         $gte:new Date(startDate),
         $lte: new Date(endDate),
       },
     }).populate("items.productId")
     
      console.log(orders);
      let totalSales = 0;
  
      orders.forEach((order) => {
        totalSales += order.totalPrice || 0;
      });
      
  
      report.downloadReport(
        req,
        res,
        orders,
        startDate,
        endDate,
        Math.round(totalSales),
        format
      );
      
    } catch (error) {
      console.log("Error while generating sales report pdf:", error);
      res.status(500).send("Internal Server Error");
    }
  };
module.exports = {
    getOrders,
    updateOrderStatus,
    genereatesalesReport
}