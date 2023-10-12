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

const categoryFields=[
  { name: "main", maxCount: 1 },
]






















admin.get("/",adminController.admin_login_get)
admin.post("/login",adminController.adminLogin)

admin.get("/Dashbord",adminController.admin_dash)

admin.get("/products",adminController.product_list)
admin.get("/add-product",adminController.add_product_get)
admin.post("/products/add-products", upload.fields(uploadFields), adminController.add_product);
admin.get("/product/edit/:id",adminController.edit_product)
admin.post("/product/edit/:id",upload.fields(uploadFields),adminController.edit)
admin.get("/product/delete/:id",adminController.product_delete);
admin.post("/product/search",adminController.product_search)



admin.get('/categories',adminController.category_list)
admin.get("/add-category",adminController.category_add_get)
admin.post("/add-category",upload.fields(categoryFields),adminController.category_add)
admin.get("/category/edit/:id",adminController.category_edit_get)
admin.post("/category/edit/:id",upload.fields(categoryFields),adminController.category_edit)
admin.get("/category/delete/:id",adminController.category_delete);
admin.post("/category/search",adminController.category_search)


admin.get('/brand',adminController.brand_list)
admin.get("/add-brand",adminController.brand_add_get)
admin.post("/add-brand",upload.fields(categoryFields),adminController.brand_add);
admin.get("/brand/edit/:id",adminController.brand_edit_get)
admin.post("/brand/edit/:id",upload.fields(categoryFields),adminController.brand_edit)
admin.get("/brand/delete/:id",adminController.brand_delete);
admin.post("/brand/search",adminController.brand_search)

admin.get("/customers",adminController.customers_list)
admin.get("/customers/block/:id",adminController.customers_block)
admin.get("/customers/unblock/:id",adminController.customers_unblock)
admin.post("/customers/search",adminController.customers_search)



admin.get("/logout",adminController.logout)


admin.get("/404",adminController.error_get)





















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