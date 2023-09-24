const express=require("express");
const session = require("express-session");
const user=express.Router()
const userControl=require("../controllers/userController");


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


//user logged home page
user.get("/user/home",(req,res)=>{
    if(req.session.logged){
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


module.exports=user;