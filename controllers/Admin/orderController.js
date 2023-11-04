const Orders = require("../../Models/order");

const getOrders=async(req,res)=>{
    try {
        const pageNum = req.query.page ? req.query.page : 1;
        console.log(pageNum);
        const perPage = 10;
        const orders = await Orders.find().skip((pageNum - 1) * perPage)
            .limit(perPage);
        let x = Number((pageNum - 1) * perPage);
        console.log(x);
        console.log(orders.length);
        var count = Math.floor(orders.length / 10) + 1;
        console.log("ordersss:", orders)
        res.render("./Admin/orders", { orders: orders, count: count, x });
    } catch (error) {
        console.log(error);
    }
}
const updateOrderStatus=async(req,res)=>{
    try {
        const orderId = req.params.orderId;
      
        const newStatus = req.body.status;
        console.log(orderId);
        console.log(newStatus);
        await Orders.findByIdAndUpdate(orderId, { status: newStatus });
        res.json({ success: true });
    } catch (error) {
       
        console.error('Error updating order status:', error);
        res.json({ success: false });
    }
}
module.exports={
    getOrders,
    updateOrderStatus
}