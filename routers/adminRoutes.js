const express=require("express")
const admin=express.Router();
const adminController = require("../controllers/Admin/adminController");
const brandController = require("../controllers/Admin/brandController");
const categoryController = require("../controllers/Admin/categoryController");
const productController = require("../controllers/Admin/productController");
const customerController = require("../controllers/Admin/customerController");
const Products = require("../Models/product");
const {upload,uploadFields,categoryFields} = require("../util/upload");
const { verifyadmin, existingadmin } = require("../middlewares/adminAuth");
const { err } = require("../middlewares/err");

























// ADMIN GENERAL===========================================================================================================================================

admin.get("/",existingadmin,adminController.admin_login_get)
admin.post("/login",adminController.adminLogin)
admin.get("/Dashbord",verifyadmin,adminController.admin_dash)
admin.get("/logout",adminController.logout)
admin.get("/404",err,adminController.error_get)

// product===========================================================================================================================================

admin.get("/products",verifyadmin,productController.product_list)
admin.get("/add-product",verifyadmin,productController.add_product_get)
admin.post("/products/add-products", upload.fields(uploadFields), productController.add_product);
admin.get("/product/edit/:id",verifyadmin,productController.edit_product)
admin.post("/product/edit/:id",upload.fields(uploadFields),productController.edit)
admin.get("/product/delete/:id",verifyadmin,productController.product_delete);
admin.post("/product/search",verifyadmin,productController.product_search)

//category ===========================================================================================================================================

admin.get('/categories',verifyadmin,categoryController.category_list)
admin.get("/add-category",verifyadmin,categoryController.category_add_get)
admin.post("/add-category",upload.fields(categoryFields),categoryController.category_add)
admin.get("/category/edit/:id",verifyadmin,categoryController.category_edit_get)
admin.post("/category/edit/:id",upload.fields(categoryFields),categoryController.category_edit)
admin.get("/category/delete/:id",verifyadmin,categoryController.category_delete);
admin.post("/category/search",verifyadmin,categoryController.category_search)

// brand===========================================================================================================================================

admin.get('/brand',verifyadmin,brandController.brand_list)
admin.get("/add-brand",verifyadmin,brandController.brand_add_get)
admin.post("/add-brand",upload.fields(categoryFields),brandController.brand_add);
admin.get("/brand/edit/:id",verifyadmin,brandController.brand_edit_get)
admin.post("/brand/edit/:id",upload.fields(categoryFields),brandController.brand_edit)
admin.get("/brand/delete/:id",verifyadmin,brandController.brand_delete);
admin.post("/brand/search",verifyadmin,brandController.brand_search)

// customers===========================================================================================================================================

admin.get("/customers",verifyadmin,customerController.customers_list)
admin.get("/customers/block/:id",verifyadmin,customerController.customers_block)
admin.get("/customers/unblock/:id",verifyadmin,customerController.customers_unblock)
admin.post("/customers/search",verifyadmin,customerController.customers_search)

// ===========================================================================================================================================
























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