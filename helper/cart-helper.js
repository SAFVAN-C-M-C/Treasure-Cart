const CART = require("../Models/cart");
const Cart=require("../Models/cart")
const { ObjectId } = require('mongodb');



module.exports={
    getCartCount: async (userId) => {
        const carData = await Cart.findOne({
          userId: new ObjectId(userId),
        });
        let cartCount = 0;
        if (carData) {
          cartCount = carData.products.length;
        }
        return cartCount;
    },
    getUserCartData: async (userId) => {
      let userCart = await Cart.aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "cartData",
          },
        },
        {
          $unwind: "$cartData",
        },
      ]);
  
      return userCart;
    },
    getTotalAmount: async (userId) => {
      let userCart = await CART.aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "cartData",
          },
        },
        {
          $unwind: "$cartData",
        },
      ]);
      let totalAmount = 0;
      userCart.forEach((cardata) => {
        if (cardata.cartData.descountedPrice) {
          totalAmount =
            totalAmount + cardata.cartData.descountedPrice * cardata.products.quantity;
        } else {
          totalAmount =
            totalAmount + cardata.cartData.basePrice * cardata.products.quantity;
        }
      });
      return totalAmount;
    },
}