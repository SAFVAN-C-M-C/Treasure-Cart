const Users = require("../../Models/user");
const Wishlist = require("../../Models/wishlist");
const { ObjectId } = require('mongodb')



//add to wishlist
const addtoWishList=async(req,res)=>{
    try {
        const userId=req.session.userid
        const {  productId } = req.body;
        const check = await Wishlist.findOne({ userId: userId });
        console.log(check);
        if(check!==null){
          const existingItem = check.products.find((item) =>
          item.productId.equals(productId)
      );
        console.log(existingItem);
        if (existingItem) {
          const Remove = await Wishlist.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { productId: productId } } },
            { new: true });
            res.json({ added: false });
          }else{
            const push=await Wishlist.findOneAndUpdate(
              { userId: userId },
              { $push: { products: { productId: productId } } },
              { new: true });
            res.json({ added: true });
          }
        }else {
          const insert = await Wishlist.insertMany(
            [
                {
                    userId: userId,
                    products: [
                        {
                            productId: productId,
                        }
                    ]
                }
            ]
        )
            res.json({ added: true });
        }

    } catch (error) {
        console.error("Error in add to wishlist:", error);
        console.log("error in add to wishlist");
        res.render('error/404')
    }
}


//wishlist
const get_wishlist = async(req, res) => {
  try {
      const data = req.session.name
     const userId=req.session.userid
    const wishlist = await Wishlist.findOne({ userId: userId }).populate('products.productId');
      res.render("./User/user-wishlist", { user: data,wishlist: wishlist.products, })
  } catch (err) {
      req.session.err = true
      res.redirect("/404")
      console.log(err);
  }
}



 const deletefromWishlist=async(req,res)=>{
    try {
      const userId=req.session.userid
      const {  productId } = req.body;
      const check = await Wishlist.findOne({ userId: userId });
      console.log(check);
      if(check!==null){
        const existingItem = check.products.find((item) =>
        item.productId.equals(productId)
    );
      console.log(existingItem);
      if (existingItem) {
        const Remove = await Wishlist.findOneAndUpdate(
          { userId: userId },
          { $pull: { products: { productId: productId } } },
          { new: true });
          res.json({ added: false });
        }
      }
        res.json({ success:true});

    } catch (error) {
      console.log("error in delete to wishlist"); 
    }
 }
 

 module.exports={
    addtoWishList,
    get_wishlist,
    deletefromWishlist
 }