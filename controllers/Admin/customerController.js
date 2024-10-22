const { ObjectId,Types } = require("mongoose");
const Users = require("../../Models/user");
const { cropImage } = require("../../util/cropImages");

// ===========================================================================================================================================

const customers_list = async (req, res) => {

    try {
        const pageNum = req.query.page ? req.query.page : 1;

        const perPage = 10;
        const totalorder=await Users.countDocuments()
        const user = await Users.aggregate([
            {
              $skip: (pageNum - 1) * perPage,
            },
            {
              $limit: perPage,
            },
          ]);
          console.log("user",user);
        let x = Number((pageNum - 1) * perPage);
        var count = Math.floor(totalorder / 10) + 1;
        res.render("./Admin/customers", { user: user, count: count, x });
    } catch (err) {
        throw err
    }

    // } else {
    //     res.redirect("/admin");
    // }
}
// ===========================================================================================================================================

const customers_block = async (req, res) => {
    try {
        const id = req.params.id;
        await Users.updateOne({ _id: new Types.ObjectId(id) }, { $set: { "status": "blocked" } });
        res.redirect("/admin/customers");
        console.log("blocked");

    } catch (err) {
        throw err;
    }
}
// ===========================================================================================================================================

const customers_unblock = async (req, res) => {
    try {
        const id = req.params.id;
        await Users.updateOne({ _id: new Types.ObjectId(id) }, { $set: { "status": "Active" } });
        console.log("unblocked");
        res.redirect("/admin/customers");

    } catch (err) {
        throw err;
    }
}
// ===========================================================================================================================================

const customers_search = async (req, res) => {
    try {
        const pageNum = req.query.page ? req.query.page : 1;
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
        var count = Math.floor(data.length / 10) + 1;
        res.render("./Admin/customers", { user: data, count: count, x });
    } catch (err) {
        throw err;
    }
}
// ===========================================================================================================================================

module.exports = {
    customers_block,
    customers_unblock,
    customers_search,
    customers_list,

}