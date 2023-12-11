const express = require("express");
const user = express.Router()
//controllers
const userControl = require("../controllers/Client/userController");
const orderController = require("../controllers/Client/orderController")
const cartConrller = require("../controllers/Client/cartController")
const productController = require("../controllers/Client/productController")
const wishlistController = require("../controllers/Client/wishlistConroller");
const couponController=require("../controllers/Client/couponController");
const walletController=require("../controllers/Client/walletController")
//auths
const passport = require("passport")
require("../config/passport")
require("../config/login-auth")
//models
const Users = require("../Models/user");
//middlewares
const { verifyUser, existingUser, otpverify, passrest, isBlocked, verifyCheckout } = require("../middlewares/userAuth");
const { err } = require("../middlewares/err");
//utility
const {   upload_profileImage,  profile, } = require("../util/upload");
const { calculateCartCount } = require("../middlewares/cartTotals");
const { couponreset } = require("../middlewares/resetsession");




//login==================================================================================
user.get('/login', existingUser,couponreset, userControl.home_get)
user.post("/login", userControl.userLogin);
//sign up==================================================================================
user.get("/SignUp", existingUser,couponreset, userControl.userSignup_get)
user.post("/signUp", userControl.userSignup)
//otp==================================================================================

user.get("/otp-sent", otpverify, userControl.otpSender)
user.get("/otp", otpverify, userControl.otp_page)
user.post("/otp", userControl.OtpConfirmation)

//forgot password==================================================================================

user.get("/forgot-pass", existingUser, userControl.forgot_password_page)
user.post("/forgot-pass", userControl.forgotPass)

//home==================================================================================

user.get("/", isBlocked,calculateCartCount,couponreset, userControl.home_logged)

//logout==================================================================================

user.get("/logout", userControl.logout)

//products==================================================================================

user.get("/product/details/:id", isBlocked,calculateCartCount,couponreset, productController.get_product_details)
user.get("/products", isBlocked,calculateCartCount,couponreset, productController.get_product)
user.post("/filter", isBlocked,calculateCartCount,couponreset, productController.filter)

user.get("/products/category/:id", isBlocked,calculateCartCount,couponreset, productController.get_product_catgorybaise)
user.get("/products/brand/:id", isBlocked,calculateCartCount,couponreset, productController.get_product_brand)



//contact us==================================================================================

user.get("/contact-us", verifyUser, isBlocked,calculateCartCount,couponreset, userControl.get_contactUs)

//profile==================================================================================

user.get('/profile', verifyUser, isBlocked,calculateCartCount,couponreset, userControl.get_profile)
user.post('/edit', upload_profileImage.fields(profile), verifyUser, isBlocked,calculateCartCount,couponreset, userControl.edit_profile)


//wishlist==================================================================================

user.get("/wishlist", verifyUser, isBlocked,calculateCartCount,couponreset, wishlistController.get_wishlist)
user.post('/wishlist', verifyUser, isBlocked,calculateCartCount,couponreset, wishlistController.addtoWishList)
user.post('/wishlistdelete/', verifyUser, isBlocked,calculateCartCount,couponreset, wishlistController.deletefromWishlist)

//manage address==================================================================================

user.get("/manage-address", verifyUser, isBlocked,calculateCartCount,couponreset, userControl.get_manageAddress)
user.post("/addAddress", verifyUser, isBlocked,calculateCartCount,couponreset, userControl.addAddress)
user.post("/edit-Address", verifyUser, isBlocked,calculateCartCount,couponreset, userControl.editAddress)
user.post("/delete-address",verifyUser,isBlocked,calculateCartCount,couponreset, userControl.deleteAddress)
//order==================================================================================


user.get("/order-sucesss",verifyCheckout, verifyUser, isBlocked,calculateCartCount, orderController.getOrderSuccess)
user.get("/order-history", verifyUser, isBlocked,calculateCartCount,couponreset, orderController.orderHistory)
user.get("/order/order-details/:orderId",verifyUser, isBlocked,calculateCartCount,couponreset, orderController.getOrderDetails)
user.get("/cancelorder/:orderId", verifyUser, isBlocked,calculateCartCount,couponreset, orderController.cancelorder)
// user.get("/returnRequest",verifyUser, isBlocked,calculateCartCount,orderController.returnProduct)
user.post("/returnOrder",verifyUser, isBlocked,calculateCartCount,orderController.returnOrder)
user.post('/downloadinvoice',verifyUser, isBlocked,calculateCartCount,couponreset,orderController.generateInvoices)
user.get('/downloadinvoice/:orderId',verifyUser, isBlocked,calculateCartCount,couponreset,orderController.downloadInvoice)
//explore==================================================================================

user.get("/explore", verifyUser, isBlocked,calculateCartCount, userControl.get_Explore)

//cart==================================================================================

user.get("/cart", verifyUser, isBlocked,calculateCartCount,couponreset, cartConrller.get_cart)
// user.get("/addToCart/:prodId",verifyUser,isBlocked,cartConrller.addTocart);
user.post("/addtoCart", verifyUser, isBlocked,calculateCartCount,couponreset, cartConrller.addtoCart)
user.post('/updatequantity', verifyUser, isBlocked,calculateCartCount,couponreset, cartConrller.updateQuantity)
user.post('/removefromcart', verifyUser, isBlocked,calculateCartCount,couponreset, cartConrller.removeFromCart)

//checkout==================================================================================
user.get("/checkout-req",verifyUser,isBlocked,userControl.setCheckout)
user.get("/checkout", verifyCheckout,verifyUser, isBlocked,calculateCartCount, userControl.getcheckout);
user.post("/checkout", verifyCheckout,verifyUser, isBlocked,calculateCartCount, orderController.placeOrder)
user.post("/verifyPayment",verifyCheckout, verifyUser, isBlocked,calculateCartCount, orderController.verifypayment)
user.post("/addAddress-Checkout", verifyUser, isBlocked,calculateCartCount, userControl.addAddressCheckout)

//reset password==================================================================================

user.get("/password/reset", passrest, userControl.get_password_reset)
user.post("/password/reset", userControl.password_reset)

//404==================================================================================

user.get("/404", err, userControl.error_get)

//about==================================================================================
user.get("/about-us",userControl.about)


//Coupons///////////////////////////////////////////////////////////////////


user.get("/myCoupons",verifyUser, isBlocked,calculateCartCount,couponController.getMycoupons);
user.post('/apply-coupon',verifyUser, isBlocked,calculateCartCount,couponController.applyCoupon)


//wallet/////////////////////////////////////////////
user.get("/mywallet",verifyUser, isBlocked,calculateCartCount,walletController.getWallet)
user.post('/use-wallet',verifyUser, isBlocked,calculateCartCount,walletController.useWallet)











































//google authentication

user.get("/google", passport.authenticate("google-signup", { scope: ["profile", "email"] }));

user.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google-signup", async (err, user, info) => {
    try {
      console.log("here at call back");
      console.log("user data :", user);
      console.log("some information is comming to call back:", info);

      if (err) {
        // Handle error
        console.error("Error during Google authentication:", err);
        req.flash("errmsg", "please try again")

        return res.redirect("/"); // Redirect to an error page
      }

      if (!user) {
        // Handle authentication failure
        console.error("Authentication failed:", info.message);
        req.flash("errmsg", "existing user,please login")
        return res.redirect("/"); // Redirect to a failure page
      }
      console.log(user);
      let userInformation = {
        userName: user.displayName,
        email: user.emails[0].value,
        veified:"true",
        status: "Active",
        profile:[{
          mainimage:"/static/images/img-bg.jpg"
        }],
        timeStamp: Date.now(),
      };
      console.log(userInformation);

      const insert = await Users.insertMany([userInformation])

      if (insert) {
        console.log("inserted");
        // Manually set a session variable with user data
        req.session.email = user.emails[0].value;
        req.session.name=user.displayName

        // Redirect to the desired page (e.g., /setSession)
        req.session.logged = true
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  })(req, res, next);// Invoke the Passport middleware
});



//

user.get(
  "/auth/login",
  passport.authenticate("google-login", { scope: ["email", "profile"] })
);
user.get(
  "/login/google/callback", (req, res, next) => {
    passport.authenticate("google-login", async (err, user, info) => {
      try {
        console.log("here at call back");
        console.log("user data :", user);
        // console.log("some information is comming to call back:",info);

        if (err) {
          // Handle error
          console.error("Error during Google authentication:", err);
          return res.redirect("/failedmail"); // Redirect to an error page
        }

        if (!user) {
          // Handle authentication failure
          // console.error("Authentication failed:", info.message);
          return res.redirect("/signUp"); // Redirect to a failure page
        }
        console.log(user);

        if (user) {
          console.log(user.emails[0].value);
          const check = await Users.findOne({ email: user.emails[0].value });
          console.log(check.status);
          if (check.status === "Active") {
            req.session.email = user.emails[0].value;
            // Redirect to the desired page (e.g., /setSession)
            req.session.logged = true
            req.session.userid = check._id
            res.redirect("/");
          } else {
            req.flash("errmsg", "*user blocked")

            req.session.errmsg = "user blocked"
            res.redirect('/login')
            console.log("user blocked");
          }
        }
      } catch (err) {
        console.log(err);
      }
    })(req, res, next);// Invoke the Passport middleware
  });
module.exports = user;