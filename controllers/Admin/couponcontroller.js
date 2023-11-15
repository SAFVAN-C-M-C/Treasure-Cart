const getCoupon=async(req,res)=>{
    try {
        const pageNum = req.query.page ? req.query.page : 1;
        const perPage = 10;
        let x = Number((pageNum - 1) * perPage);
        const coupon=[]
        var count = Math.floor(coupon.length / 10) + 1;
        res.render("./Admin/Coupon",{coupon,count,x})
    } catch (error) {
        console.log(error);
    }
}
module.exports={getCoupon}