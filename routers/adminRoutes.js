const express = require("express")
const admin = express.Router();
const adminController = require("../controllers/Admin/adminController");
const bannerController = require("../controllers/Admin/bannerController")
const brandController = require("../controllers/Admin/brandController");
const categoryController = require("../controllers/Admin/categoryController");
const productController = require("../controllers/Admin/productController");
const customerController = require("../controllers/Admin/customerController");
const orderController = require("../controllers/Admin/orderController");
const couponcontroller = require("../controllers/Admin/couponcontroller");
const returnController=require("../controllers/Admin/returnController")
const Products = require("../Models/product");
const {   
  upload_productImage,
  upload_bannerImage,
  upload_categoryImage,
  upload_brandImage,
  product,
  banner,
  category,
  brand, 
} = require("../util/upload");
const { verifyadmin, existingadmin } = require("../middlewares/adminAuth");
const { err } = require("../middlewares/err");
const Banner = require("../Models/banner");

























// ADMIN GENERAL===========================================================================================================================================

admin.get("/", existingadmin, adminController.admin_login_get)
admin.post("/login", adminController.adminLogin)
admin.get("/logout", adminController.logout)
admin.get("/404", err, adminController.error_get)
admin.post('/download-sales-report',verifyadmin, orderController.genereatesalesReport)

// Dash===========================================================================================================================================
admin.get("/Dashbord", verifyadmin, adminController.admin_dash)
admin.get('/count-orders-by-day', verifyadmin, adminController.getCountDay)
admin.get('/count-orders-by-month', verifyadmin, adminController.getCountMonth)
admin.get('/count-orders-by-year', verifyadmin, adminController.getCountYear)



// product===========================================================================================================================================

admin.get("/products", verifyadmin, productController.product_list)
admin.get("/add-product", verifyadmin, productController.add_product_get)
admin.post("/products/add-products", upload_productImage.fields(product), productController.add_product);
admin.get("/product/edit/:id", verifyadmin, productController.edit_product)
admin.post("/product/edit/:id", upload_productImage.fields(product), productController.edit)
admin.get("/product/delete/:id", verifyadmin, productController.product_delete);
admin.get("/product/active/:id", verifyadmin, productController.product_reupload);
admin.post("/product/search", verifyadmin, productController.product_search)



//category ===========================================================================================================================================



admin.get('/categories', verifyadmin, categoryController.category_list)
admin.get("/add-category", verifyadmin, categoryController.category_add_get)
admin.post("/add-category", upload_categoryImage.fields(category), categoryController.category_add)
admin.get("/category/edit/:id", verifyadmin, categoryController.category_edit_get)
admin.post("/category/edit/:id", upload_categoryImage.fields(category), categoryController.category_edit)
admin.get("/category/delete/:id", verifyadmin, categoryController.category_delete);
admin.post("/category/search", verifyadmin, categoryController.category_search)

// brand===========================================================================================================================================

admin.get('/brand', verifyadmin, brandController.brand_list)
admin.get("/add-brand", verifyadmin, brandController.brand_add_get)
admin.post("/add-brand", upload_brandImage.fields(brand), brandController.brand_add);
admin.get("/brand/edit/:id", verifyadmin, brandController.brand_edit_get)
admin.post("/brand/edit/:id", upload_brandImage.fields(brand), brandController.brand_edit)
admin.get("/brand/delete/:id", verifyadmin, brandController.brand_delete);
admin.post("/brand/search", verifyadmin, brandController.brand_search)

// customers===========================================================================================================================================

admin.get("/customers", verifyadmin, customerController.customers_list)
admin.get("/customers/block/:id", verifyadmin, customerController.customers_block)
admin.get("/customers/unblock/:id", verifyadmin, customerController.customers_unblock)
admin.post("/customers/search", verifyadmin, customerController.customers_search)

// orders===========================================================================================================================================
admin.get("/orders", verifyadmin, orderController.getOrders)
admin.post('/updateStatus/:orderId', verifyadmin, orderController.updateOrderStatus)
//return order//////////////////
admin.get("/returns", verifyadmin,returnController.getReqreturn)
admin.post("/acceptRequest",verifyadmin,returnController.acceptRequest);
//Banner ===========================================================================================================================================

admin.get("/banner", verifyadmin, bannerController.getBanner)
admin.post("/add-banner", upload_bannerImage.fields(banner), bannerController.banner_add);
admin.post("/banner-delete", verifyadmin, bannerController.deleteBanner);
admin.put("/banner-active", verifyadmin, bannerController.banneractive)
//Coupon ===========================================================================================================================================

admin.get("/coupon", verifyadmin, couponcontroller.getCoupon)
admin.post("/addCoupon",verifyadmin,couponcontroller.addCoupon)
admin.delete('/deleteCoupon/:couponId',verifyadmin, couponcontroller.deleteCoupon)
admin.post("/edit-coupon/:couponId",verifyadmin,couponcontroller.editCoupon)




















admin.get("/sample", async (req, res) => {
  try {

    const banner = await Banner.aggregate([
      {
        $match: {
          status: "Active",
        },
      },
    ]);
    
    res.render("./Admin/sample1",{banner})
  } catch (err) {
    console.log(err);
  }
})
admin.post("/sample", async (req, res) => {
  console.log(req.body);
  const data = {
    name: req.body.name,
    images: req.body.images,
    description: req.body.description,
    stock: req.body.stock,
    basePrice: req.body.basePrice,
    descountedPrice: req.body.descountedPrice,
    // variation:req.body.variation,
    timeStamp: Date.now(),
    brandId: req.body.brandid,
    categoryId: req.body.categoryId
  }
  const insert = await Products.insertMany(data);
  res.send("sdfghjk");
})

module.exports = admin;