const Brands = require("../Models/brand");
const Categories = require("../Models/category");
const Products = require("../Models/product");
const ADMIN = require("../Models/superAdmin");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const Users = require("../Models/user");


// email:'safvancmc3@gmail.com'
//123
const admin_login_get = (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin/Dashbord");
  } else {
    res.render("./Admin/admin-login", { errmsg: req.flash("errmsgadmin") });
  }
};

const adminLogin = async (req, res) => {
  try {
    const check = await ADMIN.findOne({ email: req.body.email });
    console.log(check);
    console.log(check.password);
    console.log(check.email);
    console.log(req.body);
    const hashed = check.password;
    const pass = req.body.password;
    console.log("hashed", hashed);
    console.log("pass", pass);
    let isMatch = await bcrypt.compare(pass, hashed, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result) {
        // req.session.name = check.name;
        req.session.Adminlogged = true;
        req.session.Name = check.userName;
        console.log("Login success");
        req.session.admin = true;
        res.redirect("/admin/Dashbord");
      } else {
        req.flash("errmsgadmin", "*invalid password");
        req.session.errmsg = "invalid password";
        res.redirect("/admin");
        console.log("invalid password");
      }
    });
  } catch (err) {
    req.flash("errmsgadmin", "*User not found");
    req.session.errmsg = "user not found";
    res.redirect("/admin");
    console.log("user not found", err);
  }
};

const admin_dash = (req, res) => {
  if (req.session.admin) {
    try{
        res.render("./Admin/Admin-dash");
    }catch(err){
      res.render.err=true
      res.redirect("/admin/404");
    }
  } else {
    res.redirect("/admin/logout");
  }
};

const product_list = async (req, res) => {
  if (req.session.admin) {
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
  } else {
    res.redirect("/admin/logout");
  }
};
const add_product_get = async (req, res) => {
  if (req.session.admin) {
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
  } else {
    res.redirect("/admin/logout");
  }
};

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
const edit_product = async (req, res) => {
  if (req.session.admin) {
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
  } else {
    res.redirect("/admin/logout");
  }
};
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

    throw err;
  }
};
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
const product_search = async (req, res) => {
  if (req.session.admin) {
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
      res.render("./Admin/admin-product", { products: product,count:count,x });
    }catch(err){
      console.log(err);
      res.render.err=true
      res.redirect("/admin/404");
    }
  } else {
    res.redirect("/admin/logout");
  }
};
//category page
const category_list = async(req, res) => {
  if (req.session.admin) {
    try{
      const pageNum = req.query.page?req.query.page:1;
      console.log(pageNum);
      const perPage = 10;
      const data=await Categories.find().skip((pageNum - 1) * perPage)
      .limit(perPage);
      let x = Number((pageNum - 1) * perPage);
      console.log(x);
      console.log(data.length);
      var count=Math.floor(data.length/10)+1;
      console.log("categories:",data)
      // if(!data){
      //   data={}
      // }
      res.render("./Admin/categories",{category:data,count:count,x});
    }catch(err){
      console.log(err);
      res.render.err=true
      res.redirect("/admin/404");
    }
  } else {
    res.redirect("/admin/logout");
  }
};
//add category
const category_add_get = (req, res) => {
  if (req.session.admin) {
    try{
      res.render("./Admin/add-category");
    }catch(err){
      console.log(err);
      res.render.err=true
      res.redirect("/admin/404");
    }
  } else {
    res.redirect("/admin/logout");
  }
};

const category_add=async(req,res)=>{
  try {
    const main = req.files["main"][0];

    console.log("Uploaded files:");
    console.log(main);
    const {
      Category_name
    } = req.body;

    console.log("name is " + Category_name);
    const data = {
      name: Category_name,
      images: {
        mainimage: main.filename,
      },
      timeStamp:Date.now(),
    };
    const insert = await Categories.insertMany([data]);
    res.redirect("/admin/categories");
  } catch (err) {
    console.log("error found" + err);
  }
}
const category_edit_get=async(req,res)=>{
  if (req.session.admin) {
    try{
      const id = req.params.id;
      const category = await Categories.findOne({ _id: new ObjectId(id) });
      console.log(category);
      res.render("./Admin/edit-category", {
        category: category,
      });
    }catch(err){
      console.log(err);
      res.render.err=true
      res.redirect("/admin/404");
    }
  } else {
    res.redirect("/admin/logout");
  }
}


const category_edit=async(req,res)=>{
  try {
    const id = req.params.id;
    console.log("hello it here on the edit post");
    const main = req.files["main"][0];

    // Do whatever you want with these files.
    console.log("Uploaded files:");
    console.log(main);

    const {
      Category_name,
    } = req.body;

    console.log("name is " + Category_name);
    const data = {
      name: Category_name,
      images: {
        mainimage: main.filename,
      },
      timeStamp: Date.now(),
    };
    await Categories.updateOne({ _id: new ObjectId(id) }, { $set: data });
    res.redirect("/admin/categories");
  } catch (err) {
    throw err;
  }
}
const category_delete=async (req,res)=>{
  try {
    const id = req.params.id;
    let deleted = await Categories.deleteOne({ _id: new ObjectId(id) });
    console.log("deleted");
    res.redirect("/admin/categories");
  } catch (err) {
    throw err;
  }
}
const category_search=async (req,res)=>{
  try {
    const pageNum = req.query.page?req.query.page:1;
    console.log(pageNum);
    const perPage = 10;
    const form_data = req.body;
    console.log(form_data);
    let category = await Categories.find({
      name: { $regex: "^" + form_data.search, $options: "i" },
    }).skip((pageNum - 1) * perPage)
    .limit(perPage);
    console.log(`Search Data ${category}`);
    let x = Number((pageNum - 1) * perPage);
    console.log(x);
    console.log(category.length);
    var count=Math.floor(category.length/10)+1;
    res.render("./Admin/categories", { category: category,count:count,x });
  } catch (err) {
    throw err;
  }
}

const brand_list=async(req,res)=>{
  if (req.session.admin) {
    const pageNum = req.query.page?req.query.page:1;
    console.log(pageNum);
    const perPage = 10;
    const data=await Brands.find().skip((pageNum - 1) * perPage)
    .limit(perPage);
    let x = Number((pageNum - 1) * perPage);
    console.log(x);
    console.log(data.length);
    var count=Math.floor(data.length/10)+1;
    console.log("Brands:",data)
    res.render("./Admin/Brand",{brand:data,count:count,x});
  } else {
    res.redirect("/admin");
  }
}
const brand_add_get = (req, res) => {
  if (req.session.admin) {
    res.render("./Admin/add-brand");
  } else {
    res.redirect("/admin");
  }
};

const brand_add=async(req,res)=>{
  try {
    const main = req.files["main"][0];

    console.log("Uploaded files:");
    console.log(main);
    const {
      Brand_name
    } = req.body;

    console.log("name is " + Brand_name);
    const data = {
      name: Brand_name,
      images: {
        mainimage: main.filename,
      },
      timeStamp:Date.now(),
    };
    const insert = await Brands.insertMany([data]);
    res.redirect("/admin/brand");
  } catch (err) {
    console.log("error found" + err);
  }
}
const brand_edit_get=async(req,res)=>{
  try {
    const id = req.params.id;
    const brand = await Brands.findOne({ _id: new ObjectId(id) });
    console.log(brand);
    res.render("./Admin/edit-brand", {
      brand: brand,
    });
  } catch (err) {
    throw err;
  }
}
const brand_edit=async(req,res)=>{
  try {
    const id = req.params.id;
    console.log("hello it here on the edit post");
    const main = req.files["main"][0];

    // Do whatever you want with these files.
    console.log("Uploaded files:");
    console.log(main);

    const {
      Brand_name,
    } = req.body;

    console.log("name is " + Brand_name);
    const data = {
      name: Brand_name,
      images: {
        mainimage: main.filename,
      },
      timeStamp: Date.now(),
    };
    await Brands.updateOne({ _id: new ObjectId(id) }, { $set: data });
    res.redirect("/admin/brand");
  } catch (err) {
    throw err;
  }
};
const brand_search=async (req,res)=>{
  try {
    const pageNum = req.query.page?req.query.page:1;
    console.log(pageNum);
    const perPage = 10;
    const form_data = req.body;
    console.log(form_data);
    let brand = await Brands.find({
      name: { $regex: "^" + form_data.search, $options: "i" },
    }).skip((pageNum - 1) * perPage)
    .limit(perPage);
    console.log(`Search Data ${brand}`);
    let x = Number((pageNum - 1) * perPage);
    console.log(x);
    console.log(brand.length);
    var count=Math.floor(brand.length/10)+1;
    res.render("./Admin/Brand", { brand: brand,count:count,x  });
  } catch (err) {
    throw err;
  }
}
const brand_delete=async (req,res)=>{
  try {
    const id = req.params.id;
    let deleted = await Brands.deleteOne({ _id: new ObjectId(id) });
    console.log("deleted");
    res.redirect("/admin/Brand");
  } catch (err) {
    throw err;
  }
}
const customers_list =async(req,res)=>{
  if (req.session.admin) {
    try{
      const pageNum = req.query.page?req.query.page:1;
      console.log(pageNum);
      const perPage = 10;
      const user=await Users.find().skip((pageNum - 1) * perPage)
      .limit(perPage);
      let x = Number((pageNum - 1) * perPage);
      console.log(x);
      console.log(user.length);
      var count=Math.floor(user.length/10)+1;
      console.log("userss:",user)
      res.render("./Admin/customers",{user:user,count:count,x});
    }catch(err){
      throw err
    }

  } else {
    res.redirect("/admin");
  }
}
const customers_block=async(req,res)=>{
  try{
  const id = req.params.id;
  await Users.updateOne({ _id: new ObjectId(id) }, { $set: {"status":"blocked"} });
  res.redirect("/admin/customers");
  console.log("blocked");

  }catch(err){
    throw err;
  }
}
const customers_unblock=async(req,res)=>{
  try{
  const id = req.params.id;
  await Users.updateOne({ _id: new ObjectId(id) }, { $set: {"status":"Active"} });
  console.log("unblocked");
  res.redirect("/admin/customers");

  }catch(err){
    throw err;
  }
}
const customers_search=async(req,res)=>{
  try {
    const pageNum = req.query.page?req.query.page:1;
    console.log(pageNum);
    const perPage = 10;
    const form_data = req.body;
    console.log(form_data);
    let data = await Users.find({
      userName: { $regex: "^" + form_data.search, $options: "i" },
    }).skip((pageNum - 1) * perPage)
    .limit(perPage);
    console.log(`Search Data ${data}`);
    let x = Number((pageNum - 1) * perPage);
    console.log(x);
    console.log(data.length);
    var count=Math.floor(data.length/10)+1;
    res.render("./Admin/customers", { user: data,count:count,x  });
  } catch (err) {
    throw err;
  }
}


const logout=(req,res)=>{
  req.session.destroy((err) => {
    if (err) {
        console.log(err);
        res.send('Error');
    } else {
        res.redirect('/admin');
    }
});}
const error_get=(req,res)=>{
  if(req.session.err){
    res.render("./Errors/404");
  }
  else{
    res.redirect("/admin/logout");
  }
}

module.exports = {
  admin_login_get,
  adminLogin,
  admin_dash,
  add_product,
  edit_product,
  edit,
  product_delete,
  product_search,
  brand_add_get,
  category_add_get,
  category_list,
  add_product_get,
  product_list,
  category_add,
  category_edit_get,
  category_edit,
  category_delete,
  category_search,
  brand_list,
  brand_add,
  brand_edit_get,
  brand_edit,
  brand_search,
  brand_delete,
  customers_list,
  customers_block,
  customers_unblock,
  customers_search,
  logout,
  error_get,
};
