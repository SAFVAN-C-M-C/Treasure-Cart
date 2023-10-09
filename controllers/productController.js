const Brands = require("../Models/brand");
const Categories = require("../Models/category");
const Products = require("../Models/product");

const add_product=async(req,res)=>{

        try {
          const main = req.files["main"][0];
          const img2 = req.files["image1"][0];
          const img3 = req.files["image2"][0];
      
          // Do whatever you want with these files.
          console.log("Uploaded files:");
          console.log(main);
          console.log(img2);
          console.log(img3);

          const {
            name,
            price,
            discount,
            brand,
            category,
            description,
          } = req.body;
      
          console.log("name is " + name);
          let categoryId = await Categories.find({ name: category });
          let brandId=await Brands.findOne({name:brand})
          const data={
            name:name,
            images:{
            mainimage: main.filename,
              image1: img2.filename,
              image2: img3.filename,
            },
            description:description,
            stock:stock,
            basePrice:price,
            descountedPrice:discount,
            timeStamp:Date.now(),
            brandId:new ObjectId(brandId[0]._id),
            categoryId:new ObjectId(categoryId[0]._id),
          }
          const insert=await Products.insertMany([data]);
        //   await new productCollection({
        //     productName: productname,
        //     category: new ObjectId(categoryId[0]._id),
        //     price: price,
        //     discount: discount,
        //     image: {
        //       mainimage: main.filename,
        //       image1: img2.filename,
        //       image2: img3.filename,
        //     },
        //     brand: brand,
        //     description: description,
        //     addedDate: Date.now(),

        //   }).save();
        //   let data = await categoryCollection.find({ categoryname: category });
        //   // console.log(data + " __ this category data");
        //   await categoryCollection.updateOne(
        //     { categoryname: category },
        //     { $inc: { stock: 1 } }
        //   );
          res.redirect("/admin/products");
        } catch (err) {
          console.log("error found" + err);
        }
      }

module.exports={
    add_product
}