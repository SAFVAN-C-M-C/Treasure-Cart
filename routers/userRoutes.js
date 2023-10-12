const express=require("express");
const user=express.Router()
const userControl=require("../controllers/userController");
const passport=require("passport")
require("../config/passport")
require("../config/login-auth")
const Users = require("../Models/user");





//==================================================================================
user.get('/',userControl.home_get)
//==================================================================================
user.post("/user/login",userControl.userLogin);
//==================================================================================
user.get("/user/SignUp",userControl.userSignup_get)
//==================================================================================
user.post("/user/signUp",userControl.userSignup)
//==================================================================================
user.get("/user/otp-sent",userControl.otpSender)
//==================================================================================
user.get("/user/otp",userControl.otp_page)
//==================================================================================
user.post("/user/otp",userControl.OtpConfirmation)
//==================================================================================
user.get("/user/forgot-pass",userControl.forgot_password_page)
//==================================================================================
user.post("/user/forgot-pass",userControl.forgotPass)
//==================================================================================
user.get("/user/home",userControl.home_logged)
//==================================================================================
user.get("/user/logout",userControl.logout)
//==================================================================================
user.get("/user/product/details/:id",userControl.get_product_details)
//==================================================================================
user.get("/user/products",userControl.get_product)
//==================================================================================
user.get("/user/contact-us",userControl.get_contactUs)
//==================================================================================
user.get('/user/profile',userControl.get_profile)
//==================================================================================
user.get("/user/wishlist",userControl.get_wishlist)
//==================================================================================
user.get("/user/manage-address",userControl.get_manageAddress)
//==================================================================================
user.get("/user/order",userControl.get_order)
//==================================================================================
user.get("/user/order-history",userControl.get_history)
//==================================================================================
user.get("/user/explore",userControl.get_Explore)
//==================================================================================
user.get("/user/cart",userControl.get_cart)
//==================================================================================
user.get("/user/password/reset",userControl.get_password_reset)
//==================================================================================
user.post("/user/password/reset",userControl.password_reset)
//==================================================================================
user.get("/404",userControl.error_get)
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
            return res.redirect("/failedmail"); // Redirect to an error page
          }
      
          if (!user) {
            // Handle authentication failure
            console.error("Authentication failed:", info.message);
            return res.redirect("/user/home"); // Redirect to a failure page
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
module.exports=user;