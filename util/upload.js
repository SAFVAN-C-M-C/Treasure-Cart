const multer = require("multer");
const crypto = require("crypto");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config()

// Initialize S3 client
const s3Client = new S3Client({
  region: String(process.env.S3_REGION),
  credentials: {
    accessKeyId: String(process.env.S3_ACCESS_KEY),
    secretAccessKey: String(process.env.S3_SECRET_KEY),
  },
});


const storage_product_image = multerS3({
  s3: s3Client,
  bucket: String(process.env.S3_BUCKET),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // acl: "public-read", // Optional: Set permissions for uploaded files
  key: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}.jpg`;
    cb(null, `/treasure-cart/product-images/${uniqueFile}`); // Adjust folder structure as needed
  },
})
const storage_profile_image = multerS3({
  s3: s3Client,
  bucket: String(process.env.S3_BUCKET),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // acl: "public-read", // Optional: Set permissions for uploaded files
  key: function (req, file, cb) {
    const userId=req.session.userId
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}.jpg`;
    const location=userId?`/treasure-cart/profile-images/${userId}/${uniqueFile}`:`/treasure-cart/profile-images/name/${uniqueFile}`
    cb(null, location); // Adjust folder structure as needed
  },
})
const storage_banner_image = multerS3({
  s3: s3Client,
  bucket: String(process.env.S3_BUCKET),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // acl: "public-read", // Optional: Set permissions for uploaded files
  key: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}.jpg`;
    cb(null, `/treasure-cart/banner-images/${uniqueFile}`); // Adjust folder structure as needed
  },
})
const storage_category_image = multerS3({
  s3: s3Client,
  bucket: String(process.env.S3_BUCKET),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // acl: "public-read", // Optional: Set permissions for uploaded files
  key: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}.jpg`;
    cb(null, `/treasure-cart/category-images/${uniqueFile}`); // Adjust folder structure as needed
  },
})
const storage_brand_image = multerS3({
  s3: s3Client,
  bucket: String(process.env.S3_BUCKET),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // acl: "public-read", // Optional: Set permissions for uploaded files
  key: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}.jpg`;
    cb(null, `/treasure-cart/brand-images/${uniqueFile}`); // Adjust folder structure as needed
  },
})



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
  s3Client
 }