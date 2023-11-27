function couponreset(req,res,next){
        req.session.couponid=[];
        req.session.walletClick=false;
        next();
    
}
module.exports={
    couponreset
}