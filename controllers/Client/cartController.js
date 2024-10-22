const CART = require("../../Models/cart");
const Products = require("../../Models/product");
const Users = require("../../Models/user");
const { ObjectId,Types } = require("mongoose");
const moment = require("moment");

// const { getUserCartData, getCartCount, getTotalAmount } = require("../../helper/cart-helper");



const get_cart = async (req, res) => {
    try {
        const userId = req.session.userid;    
        req.session.filter = false;

        const user = req.session.name;
        const cart = await CART.findOne({ userId: userId }).populate(
            "products.productId"
        );
        if (cart) {
            const data = cart.products
            let subtotal = 0;
            let totalQuantity = 0;

            data.forEach(item => {
                subtotal += item.quantity * item.productId.descountedPrice;
                totalQuantity += item.quantity;
            });

            const gstRate = 0.12;
            const gstAmount = subtotal * gstRate;
            const coupon = '';
            const total = subtotal + gstAmount;

            if (coupon) {
                const couponValue = 50;
                total -= couponValue;
            }
            // console.log(cart, "============================");
            // console.log(data[0].productId, "============================");
            // console.log(data[0].productId.images[0].mainimage, "============================");
            console.log(data);
            //storing everything in session for the checkout
            req.session.totalAmount = Math.round(total)
            req.session.subTotal=Math.round(subtotal);
            req.session.gstAmount=gstAmount.toFixed(2);
            req.session.totalQuantity=totalQuantity;
            let today = moment(new Date()).format("lll")
            res.render("./User/SampleCart", {
                user: user,
                data: data,
                cart: cart,
                subtotal: Math.round(subtotal),
                gstAmount: gstAmount.toFixed(2),
                totalQuantity: totalQuantity,
                coupon: coupon,
                total: Math.round(total),
                cartCount: req.session.cartCount,
                expectedDeliveryDate: moment().add(7, "days").format("ddd, MMM D, YYYY"),
            });
        } else {
            data = null
            console.log(user)
            res.render("./User/SampleCart", {
                user, data, cart: [],
                subtotal: 0,
                gstAmount: 0,
                totalQuantity: 0,
                coupon: '',
                total: 0,
                cartCount: 0,
                expectedDeliveryDate: null
            });
        }
    } catch (err) {
        console.log("Error found in User cart " + err);
    }
}
// const addTocart = async (req, res) => {
//     try {
//         const userId = req.session.userid;
//         console.log(req.session.userid);
//         const productId = req.params.prodId;
//         console.log(productId);
//         const product=await Products.findOne({_id:new ObjectId(productId)})
//         const unitPrice=product.descountedPrice
//         console.log("====================================",u);
//         const check = await CART.findOne({ userId: new ObjectId(userId) });
//         console.log(check);

//         if (check !== null) {
//             console.log("if");
//             const existingCart = check.products.find((item) =>
//                 item.productId.equals(productId)
//             );
//             if (existingCart) {
//                 existingCart.quantity += 1;
//             } else {
//                 check.products.push({ productId: productId, quantity: 1,unitPrice:product.descountedPrice });
//             }
//             await check.save();
//             req.flash("msg", "Item added to the cart")
//             res.redirect('/products')
//         } else {
//             console.log("else");

//             const insert = await CART.insertMany(
//                 [
//                     {
//                         userId: userId,
//                         products: [
//                             {
//                                 productId: productId,
//                                 quantity: 1,
//                                 unitPrice:product.descountedPrice
//                             }
//                         ]
//                     }
//                 ]
//             )
//             req.flash("msg", "Item added to the cart")
//             res.redirect("/products");
//         }
//     } catch (err) {
//         console.log("error while add product to cart", err);
//         req.flash("errmsg", "sorry at this momment we can't reach");
//         res.redirect("/products")
//     }
// }
const updateQuantity = async (req, res) => {
    console.log("*");
    console.count()
    const { productId, quantity, cartId } = req.body;
    console.log(productId);
    console.log(quantity);
    console.log(cartId);
    try {

        const cart = await CART.findOne({ _id: cartId }).populate("products.productId")

        if (!cart) {
            return res.status(404).json({ success: false, error: "Cart not found" });
        }
        const productInCart = cart.products.find(item => item.productId.equals(productId));

        if (!productInCart) {
            return res.status(404).json({ success: false, error: "Product not found in the cart" });
        }
        productInCart.quantity = quantity;

        await cart.save();

        let subtotal = 0;
        let totalQuantity = 0;
        cart.products.forEach((item) => {
            console.log(item, "isinde for each");
            subtotal += item.quantity * item.productId.descountedPrice;
            totalQuantity += item.quantity;
        });
        console.log(subtotal);
        console.count()

        const gstRate = 0.12;
        const gstAmount = (subtotal * gstRate) / 100;
        const coupon = '';
        let total = subtotal + gstAmount;

        if (coupon) {
            const couponValue = 50;
            total -= couponValue;
        }
        req.session.totalAmount = Math.round(total)
        req.session.gstAmount=gstAmount.toFixed(2)
        req.session.subTotal=Math.round(subtotal)
        req.session.totalQuantity=totalQuantity;
        res.json({
            success: true,
            subtotal: Math.round(subtotal),
            gstAmount: gstAmount.toFixed(2),
            totalQuantity: totalQuantity,
            coupon: coupon,
            total: Math.round(total),
            
        });

    } catch (error) {
        console.error('Error while updating stock quantity:', error);
        res.status(500).json({ success: false, error: "Failed to  update stock quantity" });
    }
}
//remove cart
const removeFromCart = async (req, res) => {
    try {
        const { productId, cartId } = req.body;
        const cart = await CART.findById(cartId);
        if (!cart) {
            return res.status(404).json({ success: false, error: "Cart not found" });
        }
        cart.products = cart.products.filter((item) => !item.productId.equals(productId));
        await cart.save();
        res.json({ success: true });

    } catch (error) {
        console.error('Error removing product from the cart:', error);
        res.status(500).json({ success: false, error: "Failed to remove product from the cart" });
    }
}
const addtoCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.userid;
        console.log(userId);
        console.log(productId);
        const product = await Products.findOne({ _id: new Types.ObjectId(productId) })
        const check = await CART.findOne({ userId: new Types.ObjectId(userId) });
        
        console.log(check);

        if (check !== null) {
            console.log("if");
            const existingCart = check.products.find((item) =>
                item.productId.equals(productId)
            );
            console.log(existingCart);
            if (existingCart) {
                // console.log(product);
                // console.log(product.stock);
                // console.log(existingCart.quantity);
                // console.log(product.stock>existingCart.quantity);

                if (product.stock > existingCart.quantity) {
                    // console.log("gfgfgfgfgfgf");
                    existingCart.quantity += 1;
                    req.session.productId_qnty = existingCart.quantity
                }
            } else {
                check.products.push({ productId: productId, quantity: 1,unitPrice:product.descountedPrice });
            }
            await check.save();
            req.flash("msg", "Item added to the cart")
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
                                unitPrice:product.descountedPrice
                            }
                        ]
                    }
                ]
            )
        }
        req.session.cartCount=check.products.length;
        res.json({ success: true,cartCount: req.session.cartCount });
    } catch (error) {
        console.error('Error removing product from the cart:', error);
        res.status(500).json({ success: false, error: "Failed to remove product from the cart" });
    }
}
module.exports = {
    get_cart,
    // addTocart,
    updateQuantity,
    removeFromCart,
    addtoCart
}