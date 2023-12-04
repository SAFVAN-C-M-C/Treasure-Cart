const Brands = require("../../Models/brand");
const Categories = require("../../Models/category");
const Products = require("../../Models/product");
const { ObjectId } = require("mongodb");
const { cropImage } = require("../../util/cropImages");


// ===========================================================================================================================================
const product_list = async (req, res) => {
  try {
    const pageNum = req.query.page ? req.query.page : 1;
    console.log(pageNum);
    const perPage = 10;
    const totalorder = await Products.countDocuments()

    const products = await Products.aggregate([
      {
        $skip: (pageNum - 1) * perPage,
      },
      {
        $limit: perPage,
      },
    ]);
    let x = Number((pageNum - 1) * perPage);
    var count = Math.floor(totalorder / 10) + 1;

    
    res.render("./Admin/admin-product",
      {
        products: products,
        count: count,
        x, 
        msg: req.flash("msg"), 
        errmsg: req.flash("errmg")
      });
  } catch (err) {
    res.render.err = true
    res.redirect("/admin/404");
  }

  
};
// ===========================================================================================================================================

const add_product_get = async (req, res) => {
 
  try {
    const category = await Categories.find();
    console.log(category);
    const brand = await Brands.find();
    console.log(brand);
    res.render("./Admin/add-products", { brand, category });
  } catch (err) {
    res.render.err = true
    res.redirect("/admin/404");
  }
 
};
// ===========================================================================================================================================
const add_product = async (req, res) => {
  try {
    const main = req.files["main"][0];
    const img2 = req.files["image1"][0];
    const img3 = req.files["image2"][0];

    console.log("Uploaded files:");
    console.log(main);
    console.log(img2);
    console.log(img3);
    const {
      Product_Name,
      basePrice,
      descountedPrice,
      brand,
      category,
      Description,
      stock,
    } = req.body;

    console.log("name is " + Product_Name);
    const images=[main.filename,img2.filename,img3.filename];
    cropImage(images,"product-images")
    const data = {
      name: Product_Name,
      images: {
        mainimage: main.filename,
        image1: img2.filename,
        image2: img3.filename,
      },
      description: Description,
      stock: stock,
      basePrice: basePrice,
      descountedPrice: descountedPrice,
      timeStamp: Date.now(),
      status:"Active",
      brandId: new ObjectId(brand),
      categoryId: new ObjectId(category),
    };
    const insert = await Products.insertMany([data]);
    req.flash("msg", "Product added successfully");
    res.redirect("/admin/products");
  } catch (err) {
    req.flash("errmsg", "Product couldn't add at the momment");
    console.log("error found" + err);
  }
};
// ===========================================================================================================================================
const edit_product = async (req, res) => {
  // if (req.session.admin) {
  try {
    const id = req.params.id;
    let products = await Products.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'brands', 
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $lookup: {
          from: 'categories', 
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$brand',
      },
      {
        $unwind: '$category',
      },
      // You can add more stages to your aggregation pipeline if needed
    ]);
    products=products[0];
    // console.log(products);
    const category = await Categories.find();
    // console.log(category);
    const brand = await Brands.find();
    // console.log(brand);
    res.render("./Admin/edit-product", {
      product: products,
      brand: brand,
      category: category,
    });
  } catch (err) {
    console.log(err);
    res.render.err = true
    res.redirect("/admin/404");
  }
};
// ===========================================================================================================================================
const edit = async (req,res)=>{
  try {
    const id = req.params.id;
    const product=await Products.findOne({ _id: new ObjectId(id) });

    if (req.files["main"] && req.files["image1"] && req.files["image2"]) {
      console.log("hello it here on the edit with all images");
      const main = req.files["main"][0];
      const img2 = req.files["image1"][0];
      const img3 = req.files["image2"][0];
      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);
      //cropping image
      const images=[main.filename,img2.filename,img3.filename];
      cropImage(images,"product-images")


      //setting new value
      product.name=Product_Name;
      product.images[0].mainimage=main.filename
      product.images[0].image1=img2.filename
      product.images[0].image2=img3.filename
      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
   
      
    
    }else if(req.files["main"] && req.files["image1"] && !req.files["image2"]){
      console.log("hello it here on the edit with main and image 1");
      const main = req.files["main"][0];
      const img2 = req.files["image1"][0];

      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);
      //cropping image
      const images=[main.filename,img2.filenamee];
      cropImage(images,"product-images")

      //setting new value

      product.name=Product_Name;
      product.images[0].mainimage=main.filename
      product.images[0].image1=img2.filename
      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
      

    }else if(req.files["main"] && !req.files["image1"] && req.files["image2"]){
      console.log("hello it here on the edit with main and image 2");
      const main = req.files["main"][0];
      const img3 = req.files["image2"][0];
      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);

      //cropping image
      const images=[main.filename,img3.filename];
      cropImage(images,"product-images")
      
      //setting new value

      product.name=Product_Name;
      product.images[0].mainimage=main.filename
      product.images[0].image2=img3.filename
      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
      
    }else if(req.files["main"] && !req.files["image1"] && !req.files["image2"]){
      console.log("hello it here on the edit with only main");
      const main = req.files["main"][0];
      console.log(main);

      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);
      //cropping image
      const images=[main.filename];
      cropImage(images,"product-images")
      
      //setting new value

      product.name=Product_Name;
      product.images[0].mainimage=main.filename
      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
      
    }else if(!req.files["main"] && req.files["image1"] && req.files["image2"]){
      console.log("hello it here on the edit with only image1 and image 2");

      const img2 = req.files["image1"][0];
      const img3 = req.files["image2"][0];
      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);

      //cropping image
      const images=[img2.filename,img3.filename];
      cropImage(images,"product-images")
      
      //setting new value

      product.name=Product_Name;

      product.images[0].image1=img2.filename
      product.images[0].image2=img3.filename
      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
    }else if(!req.files["main"] && req.files["image1"] && !req.files["image2"]){
      console.log("hello it here on the edit with only image1");

      const img2 = req.files["image1"][0];

      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);

      //cropping image
      const images=[img2.filename];
      cropImage(images,"product-images")
      
      //setting new value

      product.name=Product_Name;

      product.images[0].image1=img2.filename

      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
    }else if(!req.files["main"] && !req.files["image1"] && req.files["image2"]){
      console.log("hello it here on the edit with only images2");

      const img3 = req.files["image2"][0];
      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);

      //cropping image
      const images=[img3.filename];
      cropImage(images,"product-images")
      
      //setting new value

      product.name=Product_Name;

      product.images[0].image2=img3.filename
      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
    }else{
      console.log("hello it here on the edit with no images");

      const {
        Product_Name,
        basePrice,
        descountedPrice,
        brand,
        category,
        Description,
        stock,
      } = req.body;
      console.log("name is " + Product_Name);
      
      //setting new value

      product.name=Product_Name;
      product.description= Description
      product.stock= stock
      product.basePrice= basePrice
      product.descountedPrice= descountedPrice
      product.timeStamp= Date.now()
      product.brandId= new ObjectId(brand)
      product.categoryId= new ObjectId(category)
      
    }
    product.save();
    req.flash("msg", "Product edited successfully");
    res.redirect("/admin/products");
  } catch (err) {
    req.flash("errmsg", "Product couldn't edit at the momment");
    res.redirect("/admin/products");
    throw err;
  }
}
// ===========================================================================================================================================

const product_delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Products.updateOne({ _id: new ObjectId(id) },{$set:{status:"Blocked"}});
    console.log("deleted");
    res.redirect("/admin/products");
  } catch (err) {
    throw err;
  }
};
const product_reupload = async (req, res) => {
  try {
    const id = req.params.id;
    await Products.updateOne({ _id: new ObjectId(id) },{$set:{status:"Active"}});
    console.log("Active");
    res.redirect("/admin/products");
  } catch (err) {
    throw err;
  }
};
// ===========================================================================================================================================
const product_search = async (req, res) => {
  // if (req.session.admin) {
  try {
    const pageNum = req.query.page ? req.query.page : 1;
    const perPage = 10;
    let x = Number((pageNum - 1) * perPage);
    const form_data = req.body;
    console.log(form_data);
    let product = await Products.find({
      name: { $regex: "^" + form_data.search, $options: "i" },
    }).skip((pageNum - 1) * perPage)
      .limit(perPage);;
    console.log(`Search Data ${product}`);
    console.log(pageNum);
    console.log(x);
    console.log(product.length);
    var count = Math.floor(product.length / 10) + 1;
    res.render("./Admin/admin-product", { products: product, count: count, x, msg: req.flash("msg"), errmsg: req.flash("errmg") });
  } catch (err) {
    console.log(err);
    res.render.err = true
    res.redirect("/admin/404");
  }
  // } else {
  //   res.redirect("/admin/logout");
  // }
};
// ===========================================================================================================================================
const deleteimage=async (req,res)=>{
  try {
    console.log("hello");
    const productId = req.params.id;
    const imageIndex = req.params.index;
    const product = await Products.findOne({_id:new ObjectId(productId)});

    if (!product) {
      return res.status(404).send("Product not found");
    }

    let imageField = "";
    let deletedImage = "";

    if (imageIndex === "1") {
      imageField = "images.0.image1";
      deletedImage = product.images[0].image1;
    } else if (imageIndex === "2") {
      imageField = "images.0.image2";
      deletedImage = product.images[0].image2;
    } else {
      return res.status(404).send("Image not found");
    }

    await Products.updateOne(
      { _id: productId },
      { $unset: { [imageField]: 1 } }
    );

    return res.status(200).send(`Image '${deletedImage}' deleted successfully`);
  } catch (error) {
    console.error("Error while deleting the product image:", error);
    res.status(500).send("Internal Server Error");
  }

}
//==============

module.exports = {
  product_list,
  product_delete,
  product_search,
  edit_product,
  edit,
  add_product,
  add_product_get,
  product_reupload,
  deleteimage
}