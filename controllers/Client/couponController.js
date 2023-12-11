const Coupon = require("../../Models/coupon");
const { ObjectId } = require('mongodb')
const getMycoupons=async(req,res)=>{
  req.session.filter = false;

    const user=req.session.name;
    const coupon=await Coupon.find({couponType:"public"})

    res.render("./User/Coupons",{user,cartCount:req.session.cartCount,coupon:coupon?coupon:[]})
}
//apply coupon and check coupon
const applyCoupon = async (req, res) => {
    try {
      const code = req.body.couponCode;
      const total = req.body.total;
      let discount = 0;
      req.session.total=total

      const userId = req.session.userid;
    
      // Find the coupon by code
      const couponMatch = await Coupon.findOne({ couponCode: code });
      req.session.couponid=req.session.couponid || []
      console.log("=================",req.session.couponid.some(id=>id.toString()=== couponMatch._id.toString()));
  
      if (couponMatch && !req.session.couponid.some(id=>id.toString()=== couponMatch._id.toString())) {
        // Check if the coupon is active
        if (couponMatch.status === true) {
          const currentDate = new Date();
          const startDate = couponMatch.startDate;
          const endDate = couponMatch.endDate;
  
         
          if (startDate <= currentDate && currentDate <= endDate) {
           
            if (couponMatch.couponType === "public" || (couponMatch.couponType === "private" && couponMatch.userIds.includes(userId))) {
             
              if (couponMatch.limit >= 0) {
              
                const couponUsed = await Coupon.findOne({
                  couponCode: couponMatch.couponCode,
                  "usedBy.userId": userId,
                });
  
                if (couponUsed) {
                  return res.json({ error: "You have used the coupon once" });
                } else {
              
                  if (couponMatch.discountType === "fixed") {
                    if (total >= couponMatch.minAmountFixed) {
                      discount = couponMatch.amount;
                    } else {
                      return res.json({
                        error: `Cart should contain a minimum amount of ${couponMatch.minAmountFixed}`,
                      });
                    }
                  } else {
                    if (total >= couponMatch.minAmount) {
                      discount = (total * couponMatch.amount)/100;
                    } else {
                      return res.json({
                        error: `Cart should contain a minimum amount of ${couponMatch.minAmount}`,
                      });
                    }
                  }
  
                  req.session.discount_price-=Math.round(discount)
                  req.session.totalAmount = total - Math.round(discount);
  
                  
                  req.session.couponid.push(new ObjectId(couponMatch._id));
                  console.log("=====================",req.session.couponid);
                //   couponMatch.usedBy.push({
                //     userId: userId,
                //     usedAt: new Date(),
                //   });
  
                //   await couponMatch.save();
                  
                  return res.status(200).json({ success: true, discount, grandTotal: req.session.totalAmount });
                }
              } else {
                return res.json({ error: "Coupon limit reached" });
              }
            } else {
              return res.json({ error: "Coupon is not applicable to the user" });
            }
          } else {
            return res.json({ error: "Coupon is expired" });
          }
        } else {
          return res.json({ error: "Coupon is not active" });
        }
      } else {
        return res.json({ error: "No such coupon found" });
      }
    } catch (error) {
      console.error(error);
      res.json({ error: "Some error occurred" });
    }
  };
module.exports={
    getMycoupons,
    applyCoupon
}