const express=require("express");
const session = require("express-session");
const user=express.Router()
const userControl=require("../controllers/userController");
const passport=require("passport")
const bcrypt=require("bcrypt")
require("../config/passport")
require("../config/login-auth")
const USER=require("../Models/user")
const {sendOTP}=require("../controllers/otpController");
const OTP = require("../Models/otp");
const Users = require("../Models/user");


//user login 
user.get('/',(req,res)=>{
    if(req.session.logged){
        res.redirect('/user/home');
    }else{
        res.render("./User/index",{title:"Login",errmsg:req.flash("errmsg")});
    }
})
user.post("/user/login",userControl.userLogin);


//user sign up
user.get("/user/SignUp",(req,res)=>{
    res.render("./User/Signup",{title:"Signup",errmsg:req.flash("errmsg")})
})
user.post("/user/signUp",userControl.userSignup)


//otp
user.get("/user/otp-sent",userControl.otpSender)

//otp page
user.get("/user/otp",(req,res)=>{
    res.render("./User/otp");
})
// user.post("/user/forgot/otp",userControl.forgotPassOTPConfirmation)
user.post("/user/otp",userControl.OtpConfirmation)

//forgot password
user.get("/user/forgot-pass",(req,res)=>{
    req.session.forgot=true
    res.render("./User/forgot-pass")
})
user.post("/user/forgot-pass",userControl.forgotPass)


//user logged home page
user.get("/user/home",(req,res)=>{
    if(req.session.logged||req.user){
        console.log(req.session.logged);
        res.render("./User/home",{title:"Home"})
    }
    else{
        console.log(req.session.logged);
        res.redirect("/")
    }
})

 
//user logout
user.get("/user/logout",userControl.logout)


//get wish list
user.get("/user/wishlist",(req,res)=>{
  res.render("./User/user-wishlist")
})

//product listing
user.get("/user/products",(req,res)=>{
    // if(req.session.logged){
        res.render("./User/products",{title:"products"})
    // }
    // else{
    //     res.redirect("/")
    // }
})
























































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
            joined: Date.now(),
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