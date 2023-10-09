const Brands = require("../Models/brand");
const Categories = require("../Models/category");
const Products = require("../Models/product");
const ADMIN = require("../Models/superAdmin")
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb')

//Email: 'safvancmc3@gmail.com'
// email:'safvancmc3@gmail.com'
const adminLogin = async (req, res) => {
    try {
        const check = await ADMIN.findOne({email:req.body.email})
        console.log(check);
        console.log(check.password);
        console.log(check.email);
        console.log(req.body);
        const hashed=check.password;
        const pass=req.body.password;
        console.log("hashed",hashed);
        console.log("pass",pass);
        let isMatch = await bcrypt.compare(pass,hashed, (err, result)=>{
                if (err) {
                    console.log(err);
                } else if (result) {
                    // req.session.name = check.name;
                    req.session.Adminlogged = true;
                    req.session.Name = check.userName;
                    console.log("Login success");
                    req.session.admin=true;
                    res.redirect("/admin/Dashbord");
                }
                else {
                  req.flash("errmsgadmin","*invalid password")
                    req.session.errmsg = "invalid password"
                    res.redirect('/admin/login')
                    console.log("invalid password");
                }
            }
        );
    } catch (err) {
      req.flash("errmsgadmin","*User not found")
        req.session.errmsg = "user not found"
        res.redirect('/')
        console.log("user not found", err);
    }
}

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
      Product_Name,
      basePrice,
      descountedPrice,
      brand,
      category,
      Description,
      stock,
    } = req.body;

    console.log("name is " + Product_Name);
    let categoryId = await Categories.find({ name: category });
    let brandId=await Brands.findOne({name:brand})
    console.log(brandId);
    console.log(categoryId);
    const data={
      name:Product_Name,
      images:{
      mainimage: main.filename,
        image1: img2.filename,
        image2: img3.filename,
      },
      description:Description,
      stock:stock,
      basePrice:basePrice,
      descountedPrice:descountedPrice,
      timeStamp:Date.now(),
      brandId:new ObjectId(brandId._id),
      categoryId:new ObjectId(categoryId._id),
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
const edit_product=async(req,res)=>{
  try{
  const id=req.params.id;
  const products = await Products.findOne({ _id: new ObjectId(id) });
  console.log(products);
  const category=await Categories.find();
  console.log(category);
  const brand=await Brands.find();
  console.log(brand);
  res.render("./Admin/edit-product",{product:products,brand:brand,category:category})
  }catch(err){
    throw err
  }

}
const edit=async (req,res)=>{
  try{
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
    let categoryId = await Categories.find({ name: category });
    let brandId=await Brands.findOne({name:brand})
    console.log(brandId);
    console.log(categoryId);
    const data={
      name:Product_Name,
      images:{
      mainimage: main.filename,
        image1: img2.filename,
        image2: img3.filename,
      },
      description:Description,
      stock:stock,
      basePrice:basePrice,
      descountedPrice:descountedPrice,
      timeStamp:Date.now(),
      brandId:new ObjectId(brandId._id),
      categoryId:new ObjectId(categoryId._id),
    }
    const id=req.params.id;
    await Products.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );
    res.redirect("/admin/products");

  }catch(err){
    throw err;
  }
}
const product_delete=async(req,res)=>{
try{
  const id=req.params.id;
  let deleted = await Products.deleteOne({ _id: new ObjectId(id) });
  console.log("deleted");
  res.redirect("/admin/products");
}catch(err){
  throw err;
}
}
const product_search=async (req,res)=>{
try{
  const form_data=req.body
  console.log(data);
  let product = await Products.find({name: { $regex: "^" + data.search, $options: 'i' }});
  console.log(`Search Data ${product}`);
  
}catch(err){
  throw err
}
}
module.exports = {
    adminLogin,
    add_product,
    edit_product,
    edit,
    product_delete,
    product_search
}