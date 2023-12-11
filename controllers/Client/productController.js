
const Products = require("../../Models/product");
const { ObjectId } = require('mongodb')
const Brands = require("../../Models/brand")
const Categories = require("../../Models/category");
const Wishlist = require("../../Models/wishlist");


const get_product_details = async (req, res) => {
    try {
    req.session.filter = false;

        const id = req.params.id;
        const userId = req.session.userid
        const data = await Products.findOne({ _id: new ObjectId(id) });
        // console.log(data);
        const brandId = data.brandId
        const brand = await Brands.findOne({ _id: brandId })
        // console.log(brandId);
        // console.log(brand);
        const categoryId = data.categoryId
        // console.log(categoryId);
        const category = await Categories.findOne({ _id: categoryId })
        // console.log(category);
        const user = req.session.name ? req.session.name : null
        const userWishlist = await Wishlist.findOne({ userId: userId });
        const wishlist = userWishlist ? userWishlist.products : [];
        res.render("./User/product-detail", { data, user, brand, category, wishlist, cartCount: req.session.cartCount });
    } catch (err) {
        console.log(err)
        req.session.err = true
        res.redirect("/404")

    }
}
const get_product = async (req, res) => {
    try {
        const pageNum = req.query.page ? req.query.page : 1;
        const perPage = 8;
        const totalorder = await Products.countDocuments()
        req.session.checkout = false;
        let searchKey = null
        // console.log(Object.keys(req.query).length !== 0);
        if (Object.keys(req.query).length !== 0) {
            // console.log(req.query);
            req.session.search = req.query.search ? req.query.search : req.session.search;
            searchKey = req.session.search;
        }

        if (searchKey) {
            if (req.session.filter) {
                const { Category, Brand } = req.session.filterData
                if (Brand && !Category) {
                    // console.log(searchKey);
                    const key = req.query.key
                    // console.log(req.query.key);
                    let products = await Products.find({brandId: { $in: Brand }, status: "Active", name: { $regex: searchKey, $options: "i" } }).skip((pageNum - 1) * perPage).limit(perPage);

                    // console.log(products);
                    if (key == 'low') {
                        products = await Products.find({brandId: { $in: Brand }, status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'high') {
                        products = await Products.find({ brandId: { $in: Brand },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'abc') {
                        products = await Products.find({ brandId: { $in: Brand },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    } else if (key == 'cba') {
                        products = await Products.find({ brandId: { $in: Brand },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    }
                } else if (Brand && Category) {
                    // console.log(searchKey);
                    const key = req.query.key
                    // console.log(req.query.key);
                    let products = await Products.find({ brandId: { $in: Brand },categoryId: { $in: Category },status: "Active", name: { $regex: searchKey, $options: "i" } }).skip((pageNum - 1) * perPage).limit(perPage);

                    // console.log(products);
                    if (key == 'low') {
                        products = await Products.find({ brandId: { $in: Brand },categoryId: { $in: Category },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'high') {
                        products = await Products.find({ brandId: { $in: Brand },categoryId: { $in: Category },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'abc') {
                        products = await Products.find({ brandId: { $in: Brand },categoryId: { $in: Category },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    } else if (key == 'cba') {
                        products = await Products.find({ brandId: { $in: Brand },categoryId: { $in: Category },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    }
                } else if (!Brand && Category) {
                    // console.log(searchKey);
                    const key = req.query.key
                    // console.log(req.query.key);
                    let products = await Products.find({ categoryId: { $in: Category },status: "Active", name: { $regex: searchKey, $options: "i" } }).skip((pageNum - 1) * perPage).limit(perPage);

                    // console.log(products);
                    if (key == 'low') {
                        products = await Products.find({categoryId: { $in: Category }, status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'high') {
                        products = await Products.find({ categoryId: { $in: Category },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'abc') {
                        products = await Products.find({ categoryId: { $in: Category },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    } else if (key == 'cba') {
                        products = await Products.find({ categoryId: { $in: Category },status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    }
                }


                const data = req.session.name
                const userId = req.session.userid;
                const userWishlist = await Wishlist.findOne({ userId: userId });
                const wishlist = userWishlist ? userWishlist.products : [];
                const category = await Categories.find();
                const brand = await Brands.find();
                let x = Number((pageNum - 1) * perPage);
                var count = Math.floor(totalorder / 10) + 1;
                res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand, cartCount: req.session.cartCount, count, x })
            } else {
                // console.log(searchKey);
                const key = req.query.key
                // console.log(req.query.key);
                let products = await Products.find({ status: "Active", name: { $regex: searchKey, $options: "i" } }).skip((pageNum - 1) * perPage).limit(perPage);

                // console.log(products);
                if (key == 'low') {
                    products = await Products.find({ status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                } else if (key == 'high') {
                    products = await Products.find({ status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                } else if (key == 'abc') {
                    products = await Products.find({ status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    // console.log(products);
                } else if (key == 'cba') {
                    products = await Products.find({ status: "Active", name: { $regex: "^" + searchKey, $options: "i" } }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    // console.log(products);
                }

                const data = req.session.name
                const userId = req.session.userid;
                const userWishlist = await Wishlist.findOne({ userId: userId });
                const wishlist = userWishlist ? userWishlist.products : [];
                const category = await Categories.find();
                const brand = await Brands.find();
                let x = Number((pageNum - 1) * perPage);
                var count = Math.floor(totalorder / 10) + 1;
                res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand, cartCount: req.session.cartCount, count, x })
            }

        } else {
            if (req.session.filter) {
                const { Category, Brand } = req.session.filterData
                let products;
                const key = req.query.key
                // console.log(req.query.key);
                if (Brand && !Category) {
                     products = await Products.find({brandId: { $in: Brand }, status: "Active" }).skip((pageNum - 1) * perPage).limit(perPage);
                    // console.log(products);
                    if (key == 'low') {
                        products = await Products.find({brandId: { $in: Brand }, status: "Active" }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'high') {
                        products = await Products.find({ brandId: { $in: Brand },status: "Active" }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'abc') {
                        products = await Products.find({brandId: { $in: Brand }, status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    } else if (key == 'cba') {
                        products = await Products.find({ brandId: { $in: Brand },status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    }
                } else if (Brand && Category) {
                     products = await Products.find({brandId: { $in: Brand },categoryId: { $in: Category }, status: "Active" }).skip((pageNum - 1) * perPage).limit(perPage);
                    // console.log(products);
                    if (key == 'low') {
                        products = await Products.find({brandId: { $in: Brand },categoryId: { $in: Category }, status: "Active" }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'high') {
                        products = await Products.find({brandId: { $in: Brand },categoryId: { $in: Category }, status: "Active" }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'abc') {
                        products = await Products.find({brandId: { $in: Brand },categoryId: { $in: Category }, status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    } else if (key == 'cba') {
                        products = await Products.find({brandId: { $in: Brand },categoryId: { $in: Category }, status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    }
                } else if (!Brand && Category) {
                     products = await Products.find({categoryId: { $in: Category }, status: "Active" }).skip((pageNum - 1) * perPage).limit(perPage);
                    // console.log(products);
                    if (key == 'low') {
                        products = await Products.find({categoryId: { $in: Category }, status: "Active" }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'high') {
                        products = await Products.find({ categoryId: { $in: Category },status: "Active" }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                    } else if (key == 'abc') {
                        products = await Products.find({categoryId: { $in: Category }, status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    } else if (key == 'cba') {
                        products = await Products.find({categoryId: { $in: Category }, status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                        // console.log(products);
                    }
                }

    
                const data = req.session.name
                const userId = req.session.userid;
                const userWishlist = await Wishlist.findOne({ userId: userId });
                const wishlist = userWishlist ? userWishlist.products : [];
                const category = await Categories.find();
                const brand = await Brands.find();
                let x = Number((pageNum - 1) * perPage);
                var count = Math.floor(totalorder / 10) + 1;
                res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand, cartCount: req.session.cartCount, count, x })
            }else{
                const key = req.query.key
            // console.log(req.query.key);
            let products = await Products.find({ status: "Active" }).skip((pageNum - 1) * perPage).limit(perPage);
            // console.log(products);
            if (key == 'low') {
                products = await Products.find({ status: "Active" }).sort({ descountedPrice: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
            } else if (key == 'high') {
                products = await Products.find({ status: "Active" }).sort({ descountedPrice: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
            } else if (key == 'abc') {
                products = await Products.find({ status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).skip((pageNum - 1) * perPage).limit(perPage);
                // console.log(products);
            } else if (key == 'cba') {
                products = await Products.find({ status: "Active" }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 }).skip((pageNum - 1) * perPage).limit(perPage);
                // console.log(products);
            }

            const data = req.session.name
            const userId = req.session.userid;
            const userWishlist = await Wishlist.findOne({ userId: userId });
            const wishlist = userWishlist ? userWishlist.products : [];
            const category = await Categories.find();
            const brand = await Brands.find();
            let x = Number((pageNum - 1) * perPage);
            var count = Math.floor(totalorder / 10) + 1;
            res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand, cartCount: req.session.cartCount, count, x })
            }
        }
    } catch (err) {
        console.log(err)
        req.session.err = true
        res.redirect("/404")
    }
}
const filter = async (req, res) => {
    try {
        const { Category, Brand } = req.body;
        req.session.filter = true;
        req.session.filterData = { Category, Brand }
        res.redirect("/products")
        // const pageNum = req.query.page ? req.query.page : 1;
        // const perPage = 8;
        // const totalorder=await Products.countDocuments()



        // let products = [];

        // if (Brand && !Category) {
        //     const filter = { 'brandId': { $in: Brand } }
        //     products = await Products.find(filter).skip((pageNum - 1) * perPage).limit(perPage);

        // } else if (!Brand && Category) {
        //     const filter = { 'categoryId': { $in: Category } }
        //     products = await Products.find(filter).skip((pageNum - 1) * perPage).limit(perPage);

        // } else if (Brand && Category) {
        //     const filter = {}
        //     filter.brandId = { $in: Brand }
        //     filter.categoryId = { $in: Category }
        //     products = await Products.find(filter).skip((pageNum - 1) * perPage).limit(perPage);

        // }
        // const data = req.session.name
        // const userId = req.session.userid;
        // const userWishlist = await Wishlist.findOne({ userId: userId });
        // const wishlist = userWishlist ? userWishlist.products : [];
        // const category = await Categories.find();
        // const brand = await Brands.find();
        // let x = Number((pageNum - 1) * perPage);
        // var count = Math.floor(totalorder/ 10) + 1;
        // if (products.length > 0) {
        //     res.render("./User/products", { title: "products", product: products, user: data, wishlist, category, brand, cartCount: req.session.cartCount ,count,x,filtered:true})
        // }
        // else {
        //     req.session.err = true
        //     res.render("./User/products", { title: "products", product: [], user: data, wishlist, category, brand, cartCount: req.session.cartCount ,count,x,filtered:false})
        // }

    } catch (err) {
        req.session.err = true
        console.log(err);
        res.redirect("/404")
    }

}

const get_product_catgorybaise = async (req, res) => {
    try {
    req.session.filter = false;

        const categoryId = req.params.id
        const category = await Categories.findOne({ _id: categoryId });
        const key = req.query.key
        // console.log(req.query.key);
        let products = await Products.find({ status: "Active", categoryId: categoryId });
        // console.log(products);
        if (key == 'low') {
            products = await Products.find({ status: "Active", categoryId: categoryId }).sort({ descountedPrice: 1 })
        } else if (key == 'high') {
            products = await Products.find({ status: "Active", categoryId: categoryId }).sort({ descountedPrice: -1 })
        } else if (key == 'abc') {
            products = await Products.find({ status: "Active", categoryId: categoryId }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 })
            // console.log(products);
        } else if (key == 'cba') {
            products = await Products.find({ status: "Active", categoryId: categoryId }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 })
            // console.log(products);
        }

        const data = req.session.name
        const userId = req.session.userid;
        const userWishlist = await Wishlist.findOne({ userId: userId });
        const wishlist = userWishlist ? userWishlist.products : [];

        res.render("./User/Category_page", { title: "products", product: products, user: data, wishlist, cartCount: req.session.cartCount, categoryId, category: category.name })
    } catch (err) {

        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }

}
const get_product_brand = async (req, res) => {
    try {
    req.session.filter = false;
    const brandId = req.params.id
        const brand = await Brands.findOne({ _id: brandId })
        const key = req.query.key
        // console.log(req.query.key);
        let products = await Products.find({ status: "Active", brandId: brandId });

        if (key == 'low') {
            products = await Products.find({ status: "Active", brandId: brandId }).sort({ descountedPrice: 1 })
        } else if (key == 'high') {
            products = await Products.find({ status: "Active", brandId: brandId }).sort({ descountedPrice: -1 })
        } else if (key == 'abc') {
            products = await Products.find({ status: "Active", brandId: brandId }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 })
            // console.log(products);
        } else if (key == 'cba') {
            products = await Products.find({ status: "Active", brandId: brandId }).collation({ locale: 'en', strength: 2 }).sort({ name: -1 })
            // console.log(products);
        }

        const data = req.session.name
        const userId = req.session.userid;
        const userWishlist = await Wishlist.findOne({ userId: userId });
        const wishlist = userWishlist ? userWishlist.products : [];

        res.render("./User/BrandPage", { title: "products", product: products, user: data, wishlist, cartCount: req.session.cartCount, brandId, brand: brand.name })
    } catch (err) {

        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }

}
module.exports = {
    get_product,
    get_product_details,
    filter,
    get_product_catgorybaise,
    get_product_brand
}