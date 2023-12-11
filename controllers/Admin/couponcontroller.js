const Coupon = require("../../Models/coupon");
const { cropImage } = require("../../util/cropImages");
const getCoupon = async (req, res) => {
    try {
        const pageNum = req.query.page ? req.query.page : 1;
        const perPage = 10;
        let x = Number((pageNum - 1) * perPage);
        const date = new Date()
        const TotalDoc=await Coupon.countDocuments()
        const coupon  = await Coupon.aggregate([
            {
              $skip: (pageNum - 1) * perPage,
            },
            {
              $limit: perPage,
            },
          ]);
        var count = Math.floor(TotalDoc / 10) + 1;
        res.render("./Admin/Coupon", { coupon, count, x ,date})
    } catch (error) {
        console.log(error);
    }
}
const addCoupon = async (req, res) => {
    try {
        if (req.body.discountType === "fixed") {
            req.body.amount = req.body.amount[1];
        } else if (req.body.discountType === "percentage") {
            req.body.amount = req.body.amount[0];
        }
        const exist = await Coupon.findOne({ couponCode: req.body.couponCode })
        if (exist) {
            return res.json({ error: "Coupon already exist!!" })
        }
        const coupon = await Coupon.create(req.body);
        if (coupon) {
            console.log("added to collection");
            res.json({ success: true });
        } else {
            console.log("not added to collection");
            res.json({ error: "COUPON already consist" });
        }

    } catch (error) {
        console.log("error while add coupon", error);
    }


}
const deleteCoupon=async(req,res)=>{
    const couponId = req.params.couponId;
    try {
      
      await Coupon.findByIdAndRemove(couponId);
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting coupon:", error);
          res.status(500).json({ success: false, error: "Internal Server Error" });
      }
  }

  const editCoupon=async(req,res)=>{
    try {
        console.log(req.body);
      const { couponName,  discountTypeedit, minAmount, maxAmount, minAmountFixed, limit, couponType, startDate, endDate } = req.body;
      const coupon=await Coupon.findById(req.params.couponId)
      let amount=0
      const discountType=discountTypeedit;
      if(discountType== 'percentage'){
       amount = Array.isArray(req.body.amount) ? req.body.amount[0] : req.body.amount;
     
      }else if(discountType== 'fixed'){
         amount = Array.isArray(req.body.amount) ? req.body.amount[1] : req.body.amount;
       
      }
      
      coupon.couponName = couponName;
    //   coupon.couponCode = couponCode;
      coupon.discountType = discountType;
      coupon.amount = amount;
      coupon.minAmount = minAmount;
      coupon.maxAmount = maxAmount;
      coupon.minAmountFixed = minAmountFixed;
      coupon.limit = limit;
      coupon.couponType = couponType;
      coupon.startDate = startDate;
      coupon.endDate = endDate;
  
      await coupon.save();
      res.redirect('/admin/coupon');
  
    } catch (error) {
      console.error("error while editing the coupon:",error)
    }
  }
module.exports = { 
    getCoupon,
    addCoupon,
    deleteCoupon,
    editCoupon
}