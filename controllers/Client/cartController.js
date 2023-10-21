const CART = require("../../Models/cart");
const Users = require("../../Models/user");
const { ObjectId } = require('mongodb');
const { getUserCartData, getCartCount, getTotalAmount } = require("../../helper/cart-helper");



const get_cart = async(req, res) => {
    try {
        const userId=req.session.userid;
        const user=req.session.name;
        const cart = await CART.findOne({ userId: userId }).populate(
            "products.productId"
          );
          if(cart){
            const data =cart.products
          console.log(cart,"============================");
          console.log(data[0].productId,"============================");
          console.log(data[0].productId.images[0].mainimage,"============================");

          console.log(data);
          
          res.render("./User/SampleCart", { user, data });
          }else{
            data=null
            console.log(user)
            res.render("./User/SampleCart",{user,data});
          }
        // const userData = await Users.findOne({
        //   _id: new ObjectId,
        // });
        // const userId = userData._id;
        // const cartCount = await getCartCount(userId);
        // let userCartdata = await getUserCartData(userId);
        // // let totalAmount = 0;
        // let totalAmount = await getTotalAmount(userId);


        // console.log(cartCount + " in cart");
        // console.log(userCartdata + " in cart");
        // console.log(totalAmount + " in cart");
        // if (userCartdata.length <= 0) {
        //   // console.log(JSON.stringify(userCartdata) + "data");
        //   res.render("./User/SampleCart", {
        //     profile: true,
        //     id: req.params.id,
        //     cartCount,
        //     userCartdata,
        //     totalAmount,
        //     empty: false,
        //     user
        //   });
        // } else {
        //   res.render("./User/SampleCart", {
        //     // profile: true,
        //     // id: req.params.id,
        //     cartCount,
        //     userCartdata,
        //     totalAmount,
        //     // empty: true,
        //     user
        //   });
        // }
      } catch (err) {
        console.log("Error found in User cart " + err);
      }
}
const addTocart = async (req, res) => {
    try {
        const userId = req.session.userid;
        console.log(req.session.userid);
        const productId = req.params.prodId;
        console.log(productId);
        const check = await CART.findOne({ userId: new ObjectId(userId) });
        console.log(check);

        if (check !== null) {
            console.log("if");
            // const isExist = await CART.findOne({ "item.productId": productId })
            // console.log(isExist);
            // if(isExist){
            //     await CART.updateOne(
            //         {
            //             userId
            //         },
            //         {

            //                 products:{
            //                     productId:productId,
            //                     quantity:1
            //                 }

            //         }
            //     );
            // }
            // else{
            //     await CART.updateOne(
            //         {
            //             userId
            //         },
            //         {
            //             $push:{
            //                 products:{
            //                     productId:productId,
            //                     quantity:1
            //                 }
            //             }
            //         }
            //     );
            // }
            const existingCart = check.products.find((item) =>
                item.productId.equals(productId)
            );
            if (existingCart) {
                existingCart.quantity += 1;
            } else {
                check.products.push({ productId: productId, quantity: 1 });
            }
            await check.save();
            req.flash("msg", "Item added to the cart")
            res.redirect('/user/products')
        } else {
            console.log("else");

            const insert = await CART.insertMany(
                [
                    {
                        userId: userId,
                        products: [
                            {
                                productId: productId,
                                quantity: 1,
                            }
                        ]
                    }
                ]
            )
            req.flash("msg", "Item added to the cart")
            res.redirect("/user/products");
        }
    } catch (err) {
        console.log(err,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        req.flash("errmsg", "sorry at this momment we can't reach");
        res.redirect("/user/products")
    }
}
module.exports={
    get_cart,
    addTocart,
}