const express=require("express")
const admin=express.Router();
const ADMIN=require("../Models/superAdmin")
// const bcrypt=require("bcrypt");
const categories=[{categoryname:"boat"},{categoryname:"boat"},{categoryname:"boat"}]
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
    res.render("./Admin/add-products",{categories});
})

module.exports=admin;