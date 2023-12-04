const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function cropImage(files,location) {
  files.forEach((ob) => {
    sharp(`./public/${location}/${ob}`)
    .resize({
      width: 200,
      height: 200,
      fit: "cover",
      withoutEnlargement: true,
    })
    .toFile(`public/CroppedImages/${location}/${ob}`, (err) => {
      if (!err) {
        console.log(`Cropping image ${ob}`);
      } else {
        throw err;
      }
    });
  });
}
module.exports = {cropImage}