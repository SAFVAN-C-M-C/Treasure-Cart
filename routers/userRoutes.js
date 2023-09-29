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
user.get("/user/otp-sent",async(req,res)=>{
    try{
        console.log("otp route");
        const email=req.session.data.Email;
        const createdOTP=await sendOTP({email})
        res.status(200).redirect("/User/otp")
    }catch(err){
        console.log(err);
    }
})
user.get("/user/otp",(req,res)=>{
    // if(req.session.logged){
    res.render("./User/otp");

    // }else{
    //     res.redirect("/");
    // }
})
user.post("/user/otp",async(req,res)=>{
    console.log(req.body)
    try{
        const data =req.session.data;
        console.log(req.session.data);
        const Otp= await OTP.findOne({email:data.Email})
        console.log(Otp.expireAt);
        if(Date.now()>Otp.expiredAt){
            await OTP.deleteOne({email});
        }else{
            const hashed=Otp.otp
            const match=await bcrypt.compare(req.body.code,hashed);
            if(match){
                const result=await USER.insertMany([data])
                req.session.logged=true;
                res.redirect("/user/home")

            }
        }
        
        
    }catch(err){
        throw err;
    }
})

//forgot password

user.get("/user/forgot-pass",(req,res)=>{
    res.render("./User/forgot-pass")
})
user.post("/user/forgot-pass",(req,res)=>{
    
})

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
user.get("/user/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.send('Error');
        }else{
            res.redirect('/');
        }
    });
})




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