const express=require("express")
const admin=express.Router();
const ADMIN=require("../Models/superAdmin")
const fs=require("fs")
// const bcrypt=require("bcrypt");
const categories=[{categoryname:"boat"},{categoryname:"boat"},{categoryname:"boat"}]
const adminController = require("../controllers/adminController");
const multer = require("multer");
const Categories = require("../Models/category");
const Brands = require("../Models/brand");
const Products = require("../Models/product");
const crypto=require("crypto");
const { ObjectId } = require('mongodb')

























admin.get("/",(req,res)=>{
   if(req.session.admin){
    res.redirect("/admin/Dashbord")
   }else{
    res.render("./Admin/admin-login",{errmsg:req.flash("errmsgadmin")})
   }
})
admin.post("/login",adminController.adminLogin)

admin.get("/Dashbord",(req,res)=>{
  if(req.session.admin){
    res.render("./Admin/Admin-dash")
  }else{
    res.redirect("/admin")
  }
})
admin.get("/products",async(req,res)=>{
  if(req.session.admin){
    const products=await Products.find();
    console.log(products);
    res.render("./Admin/admin-product",{products:products});
  }else{
    res.redirect("/admin")
  }
})
admin.get("/add-product",async(req,res)=>{
  if(req.session.admin){
    const category=await Categories.find();
    console.log(category);
    const brand=await Brands.find();
    console.log(brand);
    res.render("./Admin/add-products",{brand,category});
  }else{
    res.redirect("/admin")
  }
})
admin.get('/categories',(req,res)=>{
  if(req.session.admin){
    res.render("./Admin/categories")
  }else{
    res.redirect("/admin")
  }
})

admin.get("/add-category",(req,res)=>{
  if(req.session.admin){
    res.render("./Admin/add-category");
  }else{
    res.redirect("/admin")
  }
})
admin.get("/add-brand",(req,res)=>{
  if(req.session.admin){
    res.render("./Admin/add-brand");
  }else{
    res.redirect("/admin")
  }
})
admin.post("/add-brand",(req,res)=>{

})


//add-product
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/product-images/");
  },
  filename: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}`;
    cb(null, uniqueFile + ".png");
  },
});
const upload = multer({ storage: storage });
const uploadFields = [
  { name: "main", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
];

const product_controller=require("../controllers/productController");
admin.post("/products/add-products", upload.fields(uploadFields), adminController.add_product);

//product edit
admin.get("/product/edit/:id",adminController.edit_product)
admin.post("/product/edit/:id",upload.fields(uploadFields),adminController.edit)

//product delete
admin.get("/product/delete/:id",adminController.product_delete);

//search product
admin.get("/product/search",adminController.product_search)


admin.get("/sample",(req,res)=>{
  res.render("./Admin/sample1")
})
admin.post("/sample",async(req,res)=>{
  console.log(req.body);
  const data={
    name:req.body.name,
    images:req.body.images,
    description:req.body.description,
    stock:req.body.stock,
    basePrice:req.body.basePrice,
    descountedPrice:req.body.descountedPrice,
    // variation:req.body.variation,
    timeStamp:Date.now(),
    brandId:req.body.brandid,
    categoryId:req.body.categoryId
  }
  const insert=await Products.insertMany(data);
res.send("sdfghjk");
})

module.exports=admin;