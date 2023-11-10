
const Products = require("../../Models/product");
const { ObjectId } = require('mongodb')
const Brands = require("../../Models/brand")
const Categories = require("../../Models/category");
const Wishlist = require("../../Models/wishlist");


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
        const user = req.session.name ? req.session.name : null
        res.render("./User/product-detail", { data, user, brand, category });
    } catch (err) {
        console.log(err)
        req.session.err = true
        res.redirect("/404")

    }
}
const get_product = async (req, res) => {
    try {
        const products = await Products.find();
        // console.log(products);
        const data = req.session.name
        const userId=req.session.userid;
        const userWishlist = await Wishlist.findOne({ userId: userId });
        const wishlist = userWishlist ? userWishlist.products : [];
        console.log("hello wish list",wishlist);
        console.log(products[0]._id);
        console.log(wishlist.includes(products[0]._id));
        res.render("./User/products", { title: "products", products: products, user: data,wishlist })
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}

module.exports={
    get_product,
    get_product_details
}