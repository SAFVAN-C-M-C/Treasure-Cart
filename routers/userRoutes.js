const express=require("express");
const session = require("express-session");
const user=express.Router()
const userControl=require("../controllers/userController");
const passport=require("passport")
const bcrypt=require("bcrypt")
require("../config/passport")
const USER=require("../Models/user")
const {sendOTP}=require("../controllers/otpController");
const OTP = require("../Models/otp");


//user login 
user.get('/',(req,res)=>{
    if(req.session.logged){
        res.redirect('/user/home');
    }else{
        res.render("./User/index",{title:"Login"});
    }
})
user.post("/user/login",userControl.userLogin);


//user sign up
user.get("/user/SignUp",(req,res)=>{
    res.render("./User/Signup",{title:"Signup"})
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




//product listing
user.get("/user/products",(req,res)=>{
    if(req.session.logged){
        res.render("./User/products",{title:"products"})
    }
})


//google authentication

user.get("/user/google",passport.authenticate("google",{scope:["profile","email"]}));

user.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:'/'}),(req,res)=>{
    res.redirect("/user/home");
})

module.exports=user;