
const Products = require("../../Models/product");
const { ObjectId } = require('mongodb')
const Brands = require("../../Models/brand")
const Categories = require("../../Models/category");
const Wishlist = require("../../Models/wishlist");


const get_product_details = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.session.userid
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
        const userWishlist = await Wishlist.findOne({ userId: userId });
        const wishlist = userWishlist ? userWishlist.products : [];
        res.render("./User/product-detail", { data, user, brand, category, wishlist });
    } catch (err) {
        console.log(err)
        req.session.err = true
        res.redirect("/404")

    }
}
const get_product = async (req, res) => {
    try {
        let searchKey=null
        // console.log(Object.keys(req.query).length !== 0);
        if(Object.keys(req.query).length !== 0){
            console.log(req.query);
            req.session.search = req.query.search?req.query.search:req.session.search;
             searchKey=req.session.search;
        }
         
        if (searchKey) {
            console.log(searchKey);
            const key = req.query.key
            console.log(req.query.key);
            let products = await Products.find({name: { $regex:   searchKey, $options: "i" }});
            // console.log(products);
            if (key == 'low') {
                products = await Products.find({name: { $regex: "^" + searchKey, $options: "i" }}).sort({ descountedPrice: 1 })
            } else if (key == 'high') {
                products = await Products.find({name: { $regex: "^" + searchKey, $options: "i" }}).sort({ descountedPrice: -1 })
            } else if (key == 'abc') {
                products = await Products.find({name: { $regex: "^" + searchKey, $options: "i" }}).collation({ locale: 'en', strength: 2 }).sort({ name: 1 })
                console.log(products);
            } else if (key == 'cba') {
                products = await Products.find({name: { $regex: "^" + searchKey, $options: "i" }}).collation({ locale: 'en', strength: 2 }).sort({ name: -1 })
                console.log(products);
            }

            const data = req.session.name
            const userId = req.session.userid;
            const userWishlist = await Wishlist.findOne({ userId: userId });
            const wishlist = userWishlist ? userWishlist.products : [];
            const category = await Categories.find();
            const brand = await Brands.find();
            res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand })
        } else {
            const key = req.query.key
            console.log(req.query.key);
            let products = await Products.find();
            // console.log(products);
            if (key == 'low') {
                products = await Products.find().sort({ descountedPrice: 1 })
            } else if (key == 'high') {
                products = await Products.find().sort({ descountedPrice: -1 })
            } else if (key == 'abc') {
                products = await Products.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 })
                console.log(products);
            } else if (key == 'cba') {
                products = await Products.find().collation({ locale: 'en', strength: 2 }).sort({ name: -1 })
                console.log(products);
            }

            const data = req.session.name
            const userId = req.session.userid;
            const userWishlist = await Wishlist.findOne({ userId: userId });
            const wishlist = userWishlist ? userWishlist.products : [];
            const category = await Categories.find();
            const brand = await Brands.find();
            res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand })
        }
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}
const filter = async (req, res) => {
    try {
        console.log(req.body);
        const { Category, Brand } = req.body;
        console.log(Category);
        console.log(Brand);
        let products = [];

        if (Brand && !Category) {
            const filter = { 'brandId': { $in: Brand } }
            products = await Products.find(filter);
            console.log(products);
        } else if (!Brand && Category) {
            const filter = { 'categoryId': { $in: Category } }
            products = await Products.find(filter);
            console.log(products);
        } else if (Brand && Category) {
            const filter = {}
            filter.brandId = { $in: Brand }
            filter.categoryId = { $in: Category }
            products = await Products.find(filter);
            console.log(products);
        }
        const data = req.session.name
        const userId = req.session.userid;
        const userWishlist = await Wishlist.findOne({ userId: userId });
        const wishlist = userWishlist ? userWishlist.products : [];
        const category = await Categories.find();
        const brand = await Brands.find();
        if (products.length > 0) {
            res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand })
        }
        else {
            req.session.err = true
            res.redirect("/404")
        }

    } catch (err) {
        req.session.err = true
        console.log(err);
        res.redirect("/404")
    }

}
module.exports = {
    get_product,
    get_product_details,
    filter
}