const express=require("express");
const user=express.Router()

//controllers
const userControl=require("../controllers/Client/userController");
const orderController=require("../controllers/Client/orderController")
const cartConrller=require("../controllers/Client/cartController")
const productController=require("../controllers/Client/productController")

//auths
const passport=require("passport")
require("../config/passport")
require("../config/login-auth")

//models
const Users = require("../Models/user");

//middlewares
const { verifyUser,existingUser, otpverify, passrest,isBlocked } = require("../middlewares/userAuth");
const { err } = require("../middlewares/err");

//utility
const { profile, upload } = require("../util/upload");




//home==================================================================================

user.get('/',existingUser,userControl.home_get)

//login==================================================================================

user.post("/user/login",userControl.userLogin);

//sign up==================================================================================

user.get("/user/SignUp",existingUser,userControl.userSignup_get)
user.post("/user/signUp",userControl.userSignup)

//otp==================================================================================

user.get("/user/otp-sent",otpverify,userControl.otpSender)
user.get("/user/otp",otpverify,userControl.otp_page)
user.post("/user/otp",userControl.OtpConfirmation)

//forgot password==================================================================================

user.get("/user/forgot-pass",existingUser,userControl.forgot_password_page)
user.post("/user/forgot-pass",userControl.forgotPass)

//home==================================================================================

user.get("/user/home",verifyUser,isBlocked,userControl.home_logged)

//logout==================================================================================

user.get("/user/logout",userControl.logout)

//products==================================================================================

user.get("/user/product/details/:id",verifyUser,isBlocked,productController.get_product_details)
user.get("/user/products",verifyUser,isBlocked,productController.get_product)

//contact us==================================================================================

user.get("/user/contact-us",verifyUser,isBlocked,userControl.get_contactUs)

//profile==================================================================================

user.get('/user/profile',verifyUser,isBlocked,userControl.get_profile)
user.post('/user/edit',upload.fields(profile),verifyUser,isBlocked,userControl.edit_profile)


//wishlist==================================================================================

user.get("/user/wishlist",verifyUser,isBlocked,userControl.get_wishlist)

//manage address==================================================================================

user.get("/user/manage-address",verifyUser,isBlocked,userControl.get_manageAddress)
user.post("/user/addAddress",verifyUser,isBlocked,userControl.addAddress)

//order==================================================================================

// user.get("/user/order",verifyUser,userControl.get_order)
// user.get("/user/order-history",verifyUser,userControl.get_history)
user.get("/user/order-sucesss",verifyUser,isBlocked,orderController.getOrderSuccess)
user.get("/user/order-history",verifyUser,isBlocked,orderController.orderHistory)
user.get("/user/cancelorder/:orderId",verifyUser,isBlocked,orderController.cancelorder)
//explore==================================================================================

user.get("/user/explore",verifyUser,isBlocked,userControl.get_Explore)

//cart==================================================================================

user.get("/user/cart",verifyUser,isBlocked,cartConrller.get_cart)
user.get("/user/addToCart/:prodId",verifyUser,isBlocked,cartConrller.addTocart);
user.post("/user/addtoCart",verifyUser,isBlocked,cartConrller.addtoCart)
user.post('/updatequantity',verifyUser,isBlocked,cartConrller.updateQuantity)
user.post('/removefromcart',verifyUser,isBlocked,cartConrller.removeFromCart)

//checkout==================================================================================

user.get("/user/checkout",verifyUser,isBlocked,userControl.getcheckout);
user.post("/user/checkout",verifyUser,isBlocked,orderController.placeOrder)
user.post("/user/addAddress-Checkout",verifyUser,isBlocked,userControl.addAddressCheckout)

//reset password==================================================================================

user.get("/user/password/reset",passrest,userControl.get_password_reset)
user.post("/user/password/reset",userControl.password_reset)

//404==================================================================================

user.get("/user/404",err,userControl.error_get)

//==================================================================================
















































//google authentication

user.get("/user/google",passport.authenticate("google-signup",{scope:["profile","email"]}));

user.get("/auth/google/callback",(req, res, next) => {
    passport.authenticate("google-signup", async(err, user, info) => {
        try{
            console.log("here at call back");
            console.log("user data :",user);
            console.log("some information is comming to call back:",info);
    
          if (err) {
            // Handle error
            console.error("Error during Google authentication:", err);
            req.flash("errmsg","please try again")

            return res.redirect("/"); // Redirect to an error page
          }
      
          if (!user) {
            // Handle authentication failure
            console.error("Authentication failed:", info.message);
            req.flash("errmsg","existing user,please login")
            return res.redirect("/"); // Redirect to a failure page
          }
          console.log(user);
          let userInformation = {
            userName: user.displayName,
            email: user.emails[0].value,
            profile: user.photos[0].value,
            status:"Active",
            timeStamp:Date.now(),
          };
          console.log(userInformation);
    
          const insert=await Users.insertMany([userInformation])
    
          if(insert){
            console.log("inserted");
            // Manually set a session variable with user data
          req.session.email = user.emails[0].value;
      
          // Redirect to the desired page (e.g., /setSession)
          req.session.logged=true
           res.redirect("/user/home");
          }
        }catch(err){
            console.log(err);
        }
    }) (req, res, next);// Invoke the Passport middleware
  });



  //

  user.get(
    "/auth/login",
    passport.authenticate("google-login", { scope: ["email", "profile"] })
  );
  user.get(
    "/login/google/callback",(req, res, next) =>{
        passport.authenticate("google-login", async(err, user, info) => {
            try{
                console.log("here at call back");
                console.log("user data :",user);
                // console.log("some information is comming to call back:",info);
        
              if (err) {
                // Handle error
                console.error("Error during Google authentication:", err);
                return res.redirect("/failedmail"); // Redirect to an error page
              }
          
              if (!user) {
                // Handle authentication failure
                // console.error("Authentication failed:", info.message);
                return res.redirect("/user/signUp"); // Redirect to a failure page
              }
              console.log(user);
        
              if(user){
                console.log(user.emails[0].value);
                const check= await Users.findOne({email:user.emails[0].value});
                console.log(check.status);
                if (check.status === "Active"){
                  req.session.email = user.emails[0].value;
              // Redirect to the desired page (e.g., /setSession)
              req.session.logged=true
              req.session.userid=check._id
               res.redirect("/user/home");
                }else{
                  req.flash("errmsg", "*user blocked")

                    req.session.errmsg = "user blocked"
                    res.redirect('/')
                    console.log("user blocked");
                }
              }
            }catch(err){
                console.log(err);
            }
        }) (req, res, next);// Invoke the Passport middleware
      });
module.exports=user;