const multer = require("multer");
const crypto = require("crypto");




//file upload
const storage_product_image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/product-images/");
  },
  filename: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}`;
    cb(null, uniqueFile + ".png");
  },
});

const storage_profile_image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/profile-images/");
  },
  filename: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}`;
    cb(null, uniqueFile + ".png");
  },
});



const storage_banner_image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/banner-images/");
  },
  filename: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}`;
    cb(null, uniqueFile + ".jpg");
  },
});
const storage_category_image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/category-images/");
  },
  filename: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}`;
    cb(null, uniqueFile + ".jpg");
  },
});
const storage_brand_image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/brand-images/");
  },
  filename: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}`;
    cb(null, uniqueFile + ".jpg");
  },
});





const upload_productImage = multer({ storage: storage_product_image });
const upload_profileImage = multer({ storage: storage_profile_image });
const upload_bannerImage = multer({ storage: storage_banner_image });
const upload_categoryImage = multer({ storage: storage_category_image });
const upload_brandImage = multer({ storage: storage_brand_image });

const product = [
  { name: "main", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
];

const category = [
  { name: "main", maxCount: 1 },
]
const brand = [
  { name: "main", maxCount: 1 },
]
const profile = [
  { name: "main", maxCount: 1 },
]
const banner = [
  { name: "main", maxCount: 1 },
]
module.exports = { 
  upload_productImage,
  upload_profileImage,
  upload_bannerImage,
  upload_categoryImage,
  upload_brandImage,
  product,
  profile,
  banner,
  category,
  brand,
 }