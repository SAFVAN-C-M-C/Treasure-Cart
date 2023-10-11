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
const Products = require("../Models/product");
const { ObjectId } = require('mongodb')



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
user.get("/user/home",async(req,res)=>{
    if(req.session.logged||req.user){
        console.log(req.session.logged);
        const find=await Users.findOne({email:req.session.email})
        console.log(find);
      const data=find.userName
      req.session.name=data
      console.log(data);
        res.render("./User/home",{title:"Home",user:data})
    }
    else{
        console.log(req.session.logged);
        res.redirect("/")
    }
})

 
//user logout
user.get("/user/logout",userControl.logout)

user.get("/user/product/details/:id",async(req,res)=>{
  // if(req.session.admin){
    const id=req.params.id;
const data = await Products.findOne({ _id: new ObjectId(id) });
res.render("./User/product-detail",{data});
// }else{
//     res.redirect('/admin')
// }
  
})


//product listing
user.get("/user/products",async(req,res)=>{
    // if(req.session.logged){
        const products=await Products.find();
        console.log(products);
        const data=req.session.name
        res.render("./User/products",{title:"products",products:products,user:data})
    // }
    // else{
    //     res.redirect("/")
    // }
})




//contact us
user.get("/user/contact-us",(req,res)=>{
  res.render("./User/contact-us")
})
//profile
user.get('/user/profile',(req,res)=>{
  res.render("./User/profile")
})
//get wish list
user.get("/user/wishlist",(req,res)=>{
  const data=req.session.name
  res.render("./User/user-wishlist",{user:data})
})
//manage
user.get("/user/manage-address",(req,res)=>{
  res.render("./User/address-manage")
})
//my order
user.get("/user/order",(req,res)=>{
  res.render("./User/orders")
})
//history order
user.get("/user/order-history",(req,res)=>{
  res.render("./User/history");
})
//reset
user.get("/user/reset",(req,res)=>{
  res.render("./User/reset");
})
//expolre
user.get("/user/explore",(req,res)=>{
  res.render("./User/explore");
})
user.get("/user/cart",(req,res)=>{
  res.render("./User/cart")
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