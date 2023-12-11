const path = require("path");
const fs = require("fs");


const deleteImageFile=(filename)=>{
    fs.unlink(`./public/CroppedImages/product-images/${filename}`, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
        } else {
          console.log(`File ${filename} has been successfully deleted`);
        }
    });
    fs.unlink(`./public/product-images/${filename}`, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
        } else {
          console.log(`File ${filename} has been successfully deleted`);
        }
    });

}
module.exports={
    deleteImageFile

}