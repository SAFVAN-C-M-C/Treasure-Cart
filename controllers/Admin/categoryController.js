const Categories = require("../../Models/category");
const { ObjectId,Types } = require("mongoose");
const { cropImage } = require("../../util/cropImages");
// ===========================================================================================================================================

//category page
const category_list = async (req, res) => {

    try {
        const pageNum = req.query.page ? req.query.page : 1;
        const perPage = 10;
        const totalorder=await Categories.countDocuments()
        const data = await Categories.aggregate([
            {
              $skip: (pageNum - 1) * perPage,
            },
            {
              $limit: perPage,
            },
          ]);
        let x = Number((pageNum - 1) * perPage);
        var count = Math.floor(totalorder / 10) + 1;
        res.render("./Admin/categories", { category: data, count: count, x });
    } catch (err) {
        console.log(err);
        res.render.err = true
        res.redirect("/admin/404");
    }

};
// ===========================================================================================================================================

//add category
const category_add_get = (req, res) => {
    // if (req.session.admin) {
    try {
        res.render("./Admin/add-category");
    } catch (err) {
        console.log(err);
        res.render.err = true
        res.redirect("/admin/404");
    }
    // } else {
    //     res.redirect("/admin/logout");
    // }
};
// ===========================================================================================================================================

const category_add = async (req, res) => {
    try {
        const main = req.files["main"][0];
        const {
            Category_name
        } = req.body;
        const check = await Categories.findOne({
            name: { $regex: `^${Category_name}$`, $options: "i" },
        });
        const images=[main.key];
        cropImage(images)
        if (!check) {
            const data = {
                name: Category_name,
                images: {
                    mainimage: `https://s3.ap-south-1.amazonaws.com/projects.safvancmc/${main.key}`,
                },
                timeStamp: Date.now(),
            };
            const insert = await Categories.insertMany([data]);
        }
        res.redirect("/admin/categories");
    } catch (err) {
        console.log("error found" + err);
    }
}
// ===========================================================================================================================================

const category_edit_get = async (req, res) => {
    // if (req.session.admin) {
    try {
        const id = req.params.id;
        const category = await Categories.findOne({ _id: new Types.ObjectId(id) });
        console.log(category);
        res.render("./Admin/edit-category", {
            category: category,
        });
    } catch (err) {
        console.log(err);
        res.render.err = true
        res.redirect("/admin/404");
    }
    // } else {
    //     res.redirect("/admin/logout");
    // }
}

// ===========================================================================================================================================

const category_edit = async (req, res) => {
    try {
        if (req.files["main"]) {
            const id = req.params.id;
            const main = req.files["main"][0];
            const Category=await Categories.findOne({_id: new Types.ObjectId(id)});

            const {
                Category_name,
            } = req.body;
            const check = Categories.findOne({ name: Category_name })
            const images=[main.key];
            console.log(main.filename);
            cropImage(images)
            if (!check) {
                Category.name=Category_name;
                Category.images[0].mainimage=`https://s3.ap-south-1.amazonaws.com/projects.safvancmc/${main.key}`;
                Category.timeStamp=Date.now();
            }else{
                Category.images[0].mainimage=`https://s3.ap-south-1.amazonaws.com/projects.safvancmc/${main.key}`;
                Category.timeStamp=Date.now();
            }
            Category.save()
            console.log("name is " + Category_name);

            res.redirect("/admin/categories");
        } else {
            const id = req.params.id;
            console.log("hello it here on the edit post");
            const {
                Category_name,
            } = req.body;

            console.log("name is " + Category_name);
            const check = Categories.findOne({ name: Category_name });
            if (!check) {
                const data = {
                    name: Category_name,
                    timeStamp: Date.now(),
                };
                await Categories.updateOne({ _id: new Types.ObjectId(id) }, { $set: data });
            }

            res.redirect("/admin/categories");
        }
    } catch (err) {
        throw err;
    }
}
// ===========================================================================================================================================

const category_delete = async (req, res) => {
    try {
        const id = req.params.id;
        let deleted = await Categories.deleteOne({ _id: new Types.ObjectId(id) });
        console.log("deleted");
        res.redirect("/admin/categories");
    } catch (err) {
        throw err;
    }
}
// ===========================================================================================================================================

const category_search = async (req, res) => {
    try {
        const pageNum = req.query.page ? req.query.page : 1;
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
        var count = Math.floor(category.length / 10) + 1;
        res.render("./Admin/categories", { category: category, count: count, x });
    } catch (err) {
        throw err;
    }
}
// ===========================================================================================================================================

module.exports = {
    category_add_get,
    category_delete,
    category_edit,
    category_edit_get,
    category_list,
    category_search,
    category_add
}  