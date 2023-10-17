const Brands = require("../../Models/brand");
const { ObjectId } = require("mongodb");




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
  module.exports={
    brand_list,
    brand_add_get,
    brand_add,
    brand_edit_get,
    brand_edit,
    brand_delete,
    brand_search
  }