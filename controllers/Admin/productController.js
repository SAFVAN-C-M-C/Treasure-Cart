const Brands = require("../../Models/brand");
const Categories = require("../../Models/category");
const Products = require("../../Models/product");
const { ObjectId } = require("mongodb");


// ===========================================================================================================================================
const product_list = async (req, res) => {
  // if (req.session.admin) {
    try{
      const pageNum = req.query.page?req.query.page:1;
      console.log(pageNum);
      const perPage = 10;
      const products = await Products.find().skip((pageNum - 1) * perPage)
      .limit(perPage);
      let x = Number((pageNum - 1) * perPage);
      console.log(x);
      console.log(products.length);
      var count=Math.floor(products.length/10)+1;
      res.render("./Admin/admin-product", { products: products,count:count,x,msg:req.flash("msg"),errmsg:req.flash("errmg") });
    }catch(err){
      res.render.err=true
      res.redirect("/admin/404");
    }
  // } else {
  //   res.redirect("/admin/logout");
  // }
};
// ===========================================================================================================================================

const add_product_get = async (req, res) => {
  // if (req.session.admin) {
    try{
      const category = await Categories.find();
      console.log(category);
      const brand = await Brands.find();
      console.log(brand);
      res.render("./Admin/add-products", { brand, category });
    }catch(err){
      res.render.err=true
      res.redirect("/admin/404");
    }
  // } else {
  //   res.redirect("/admin/logout");
  // }
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
    let categoryId = await Categories.findOne({ name: category });
    let brandId = await Brands.findOne({ name: brand });
    console.log(brandId);
    console.log(categoryId);
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
      brandId: new ObjectId(brandId._id),
      categoryId: new ObjectId(categoryId._id),
    };
    const insert = await Products.insertMany([data]);
    req.flash("msg","Product added successfully");
    res.redirect("/admin/products");
  } catch (err) {
    req.flash("errmsg","Product couldn't add at the momment");
    console.log("error found" + err);
  }
};
// ===========================================================================================================================================
const edit_product = async (req, res) => {
  // if (req.session.admin) {
    try{
      const id = req.params.id;
    const products = await Products.findOne({ _id: new ObjectId(id) });
    console.log(products);
    const category = await Categories.find();
    console.log(category);
    const brand = await Brands.find();
    console.log(brand);
    res.render("./Admin/edit-product", {
      product: products,
      brand: brand,
      category: category,
    });
    }catch(err){
      res.render.err=true
      res.redirect("/admin/404");
    }
  // } else {
  //   res.redirect("/admin/logout");
  // }
};
// ===========================================================================================================================================
const edit = async (req, res) => {
  try {
    console.log("hello it here on the edit post");
    const main = req.files["main"][0];
    const img2 = req.files["image1"][0];
    const img3 = req.files["image2"][0];

    // Do whatever you want with these files.
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
    let categoryId = await Categories.findOne({ name: category });
    let brandId = await Brands.findOne({ name: brand });
    console.log(brandId._id);
    console.log(categoryId);
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
      brandId: new ObjectId(brandId._id),
      categoryId: new ObjectId(categoryId._id),
    };
    const id = req.params.id;
    await Products.updateOne({ _id: new ObjectId(id) }, { $set: data });
    req.flash("msg","Product edited successfully");
    res.redirect("/admin/products");
  } catch (err) {
    req.flash("errmsg","Product couldn't edit at the momment");
    res.redirect("/admin/products");

    throw err;
  }
};
// ===========================================================================================================================================

const product_delete = async (req, res) => {
  try {
    const id = req.params.id;
    let deleted = await Products.deleteOne({ _id: new ObjectId(id) });
    console.log("deleted");
    res.redirect("/admin/products");
  } catch (err) {
    throw err;
  }
};
// ===========================================================================================================================================
const product_search = async (req, res) => {
  // if (req.session.admin) {
    try{
      const pageNum = req.query.page?req.query.page:1;
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
      var count=Math.floor(product.length/10)+1;
      res.render("./Admin/admin-product", { products: product,count:count,x,msg:req.flash("msg"),errmsg:req.flash("errmg") });
    }catch(err){
      console.log(err);
      res.render.err=true
      res.redirect("/admin/404");
    }
  // } else {
  //   res.redirect("/admin/logout");
  // }
};
// ===========================================================================================================================================
module.exports={
  product_list,
  product_delete,
  product_search,
  edit_product,
  edit,
  add_product,
  add_product_get
}