const CART = require("../Models/cart");




const calculateCartCount = async (req, res, next) => {
    try {
      const userId=req.session.userid;
        if(userId){
            const userCart = await CART.findOne({ userId:userId });
            console.log("cart count",userCart);
            if (userCart) {
     
                let cartCount = userCart.products.length;
                
          
                req.session.cartCount = cartCount;
                // console.log("Cart Count:", res.locals.cartCount);
          
              }  else{
                req.session.cartCount = 0;
              }
        } else {
            req.session.cartCount = 0; 
        }

    // console.log("ddddddddddddddddddddddddddddddddddd",req.session.cartCount);
    next();

}catch (error) {
    console.error(error);
    res.locals.cartCount = 0; 
    next();
  }
};
  
  module.exports = {calculateCartCount};
  