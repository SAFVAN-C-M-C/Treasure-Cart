// const express=require("express");
// const product_route=express();
// const multer=require("multer");
// const crypto=require("crypto");
// const path=require("path");

// product_route.use(express.static("Public"));

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/product-images/");
//     },
//     filename: function (req, file, cb) {
//       const randomeString = crypto.randomBytes(3).toString("hex");
//       const timestamp = Date.now();
//       const uniqueFile = `${timestamp}-${randomeString}`;
//       cb(null, uniqueFile + ".png");
//     },
//   });
//   const upload = multer({ storage: storage });
//   const uploadFields = [
//     { name: "main", maxCount: 1 },
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//     { name: "image3", maxCount: 1 },
//     { name: "image4", maxCount: 1 },
//   ];
  
// const product_controller=require("../controllers/productController");
// product_route.post("/products/add-products", upload.fields(uploadFields), product_controller.addProduct);

