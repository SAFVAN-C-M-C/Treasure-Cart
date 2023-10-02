const express=require("express")
const admin=express.Router();
const ADMIN=require("../Models/superAdmin")
// const bcrypt=require("bcrypt");
const adminController = require("../controllers/adminController");

admin.get("/login",(req,res)=>{
    res.render("./Admin/admin-login")
})
admin.post("/login",adminController.adminLogin)

admin.get("/Dashbord",(req,res)=>{
    res.render("./Admin/Admin-dash")
})
admin.get("/products",(req,res)=>{
    res.render("./Admin/admin-product");
})
admin.get("/add-product",(req,res)=>{
    res.render("./Admin/add-products");
})

module.exports=admin;