
const Products = require("../../Models/product");
const { ObjectId } = require('mongodb')
const Brands = require("../../Models/brand")
const Categories = require("../../Models/category")


const get_product_details = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Products.findOne({ _id: new ObjectId(id) });
        console.log(data);
        const brandId = data.brandId
        const brand = await Brands.findOne({ _id: brandId })
        console.log(brandId);
        console.log(brand);
        const categoryId = data.categoryId
        console.log(categoryId);
        const category = await Categories.findOne({ _id: categoryId })
        console.log(category);
        const user = req.session.name ? req.session.name : "User"
        res.render("./User/product-detail", { data, user, brand, category });
    } catch (err) {
        console.log(err)
        req.session.err = true
        res.redirect("/user/404")

    }
}
const get_product = async (req, res) => {
    try {
        const products = await Products.find();
        console.log(products);
        const data = req.session.name
        res.render("./User/products", { title: "products", products: products, user: data })
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
}

module.exports={
    get_product,
    get_product_details
}