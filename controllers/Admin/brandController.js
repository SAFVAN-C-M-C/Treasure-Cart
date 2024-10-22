const Brands = require("../../Models/brand");
const { ObjectId } = require("mongodb");
const { cropImage } = require("../../util/cropImages");

const brand_list = async (req, res) => {
  const pageNum = req.query.page ? req.query.page : 1;
  const perPage = 10;
  const totalorder = await Brands.countDocuments()

  const data = await Brands.aggregate([
    {
      $skip: (pageNum - 1) * perPage,
    },
    {
      $limit: perPage,
    },
  ]);

  let x = Number((pageNum - 1) * perPage);
  var count = Math.floor(totalorder / 10) + 1;
  res.render("./Admin/Brand", { brand: data, count: count, x });
}
const brand_add_get = (req, res) => {
  res.render("./Admin/add-brand");
};

const brand_add = async (req, res) => {
  try {
    const main = req.files["main"][0];
    const {
      Brand_name
    } = req.body;
    const images = [main.key]
    const check = await Brands.findOne({ name: Brand_name })
    await cropImage(images)
    if (!check) {
      const data = {
        name: Brand_name,
        images: {
          mainimage: main.location,
        },
        timeStamp: Date.now(),
      };
      const insert = await Brands.insertMany([data]);
    }
    res.redirect("/admin/brand");
  } catch (err) {
    console.log("error found" + err);
  }
}
const brand_edit_get = async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await Brands.findOne({ _id: new ObjectId(id) });
    res.render("./Admin/edit-brand", {
      brand: brand,
    });
  } catch (err) {
    throw err;
  }
}
const brand_edit = async (req, res) => {
  try {
    if (req.files["main"]) {
      const id = req.params.id;
      const brand = await Brands.findOne({ _id: new ObjectId(id) });
      const main = req.files["main"][0];
      const {
        Brand_name,
      } = req.body;
      const check = Brands.findOne({ name: Brand_name });
      const images = [main.key];
      cropImage(images)
      if (!check) {
        brand.name = Brand_name;
        brand.images[0].mainimage = main.location;
        brand.timeStamp = Date.now();
      } else {
        brand.images[0].mainimage = main.location;
        brand.timeStamp = Date.now();
      }
      brand.save()
      res.redirect("/admin/brand");
    } else {
      const id = req.params.id;
      const {
        Brand_name,
      } = req.body;
      const check = Brands.findOne({ name: Brand_name });
      if (!check) {
        const data = {
          name: Brand_name,
          timeStamp: Date.now(),
        };
        await Brands.updateOne({ _id: new ObjectId(id) }, { $set: data });
      }
      res.redirect("/admin/brand");
    }
  } catch (err) {
    throw err;
  }
};
const brand_search = async (req, res) => {
  try {
    const pageNum = req.query.page ? req.query.page : 1;
    const perPage = 10;
    const form_data = req.body;
    let brand = await Brands.find({
      name: { $regex: "^" + form_data.search, $options: "i" },
    }).skip((pageNum - 1) * perPage)
      .limit(perPage);
    let x = Number((pageNum - 1) * perPage);
    var count = Math.floor(brand.length / 10) + 1;
    res.render("./Admin/Brand", { brand: brand, count: count, x });
  } catch (err) {
    throw err;
  }
}
const brand_delete = async (req, res) => {
  try {
    const id = req.params.id;
    let deleted = await Brands.deleteOne({ _id: new ObjectId(id) });
    res.redirect("/admin/Brand");
  } catch (err) {
    throw err;
  }
}
module.exports = {
  brand_list,
  brand_add_get,
  brand_add,
  brand_edit_get,
  brand_edit,
  brand_delete,
  brand_search
}