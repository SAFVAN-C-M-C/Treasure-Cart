const multer = require("multer");
const crypto = require("crypto");




//file upload
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

const categoryFields = [
  { name: "main", maxCount: 1 },
]
const profile = [
  { name: "main", maxCount: 1 },
]
module.exports = { upload, uploadFields, categoryFields, profile }