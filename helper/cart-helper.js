// const CART = require("../Models/cart");
// const Cart=require("../Models/cart")
// const { ObjectId } = require('mongodb');



// module.exports={


//     getTotalAmount: async (userId) => {
//       let userCart = await CART.aggregate([
//         { $match: { userId: new ObjectId(userId) } },
//         {
//           $unwind: "$products",
//         },
//         {
//           $lookup: {
//             from: "products",
//             localField: "products.productId",
//             foreignField: "_id",
//             as: "cartData",
//           },
//         },
//         {
//           $unwind: "$cartData",
//         },
//       ]);
//       let totalAmount = 0;
//       userCart.forEach((cardata) => {
//         if (cardata.cartData.descountedPrice) {
//           totalAmount =
//             totalAmount + cardata.cartData.descountedPrice * cardata.products.quantity;
//         } else {
//           totalAmount =
//             totalAmount + cardata.cartData.basePrice * cardata.products.quantity;
//         }
//       });
//       return totalAmount;
//     },
// }