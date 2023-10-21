const { ObjectId } = require("mongodb");
const Users = require("../../Models/user");


// ===========================================================================================================================================

const customers_list = async (req, res) => {
    // if (req.session.admin) {
        try {
            const pageNum = req.query.page ? req.query.page : 1;
            console.log(pageNum);
            const perPage = 10;
            const user = await Users.find().skip((pageNum - 1) * perPage)
                .limit(perPage);
            let x = Number((pageNum - 1) * perPage);
            console.log(x);
            console.log(user.length);
            var count = Math.floor(user.length / 10) + 1;
            console.log("userss:", user)
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
        await Users.updateOne({ _id: new ObjectId(id) }, { $set: { "status": "blocked" } });
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
        await Users.updateOne({ _id: new ObjectId(id) }, { $set: { "status": "Active" } });
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