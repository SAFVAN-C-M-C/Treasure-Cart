
const Orders = require("../../Models/order");
const ADMIN = require("../../Models/superAdmin");
const bcrypt = require("bcrypt");
const moment = require("moment")
const { cropImage } = require("../../util/cropImages");

// ===========================================================================================================================================

// email:'safvancmc3@gmail.com'
//123
const admin_login_get = (req, res) => {
  res.render("./Admin/admin-login", { errmsg: req.flash("errmsgadmin") });
};
// ===========================================================================================================================================

const adminLogin = async (req, res) => {
  try {
    const check = await ADMIN.findOne({ email: req.body.email });
    const hashed = check.password;
    const pass = req.body.password;

    let isMatch = await bcrypt.compare(pass, hashed, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result) {
        // req.session.name = check.name;
        req.session.Adminlogged = true;
        req.session.Name = check.userName;
        // console.log("Login success");
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
// ===========================================================================================================================================

const admin_dash = async(req, res) => {
  // if (req.session.admin) {
  try {
    const order=await Orders.find().sort({ _id: -1 }).limit(5)


    const bestSeller = await Orders.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.productId",
          totalCount: { $sum: "$items.quantity" },
        },
      },
      {
        $sort: {
          totalCount: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
    ]);
    // console.log(bestSeller);
    res.render("./Admin/Admin-dash",{order,bestSeller});
  } catch (err) {
    res.render.err = true
    res.redirect("/admin/404");
  }
  // } else {
  //   res.redirect("/admin/logout");
  // }
};

// ===========================================================================================================================================

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      res.redirect('/admin');
    }
  });
}
// ===========================================================================================================================================

const error_get = (req, res) => {
  // if(req.session.err){
  res.render("./Errors/404");
  // }
  // else{
  //   res.redirect("/admin/logout");
  // }
}
// ===========================================================================================================================================
const getCountYear = async (req, res) => {
  try {
    const orders = await Orders.find({
      status: {
        $in: ["Delivered"]
      }
    });

    const orderCountsByYear = {};
    const totalAmountByYear = {};
    let labelsByCount;
    let labelsByAmount;
    let dataByCount;
    let dataByAmount;




    orders.forEach((order) => {
      const orderDate = moment(order.orderDate, "ddd, MMM DD, YYYY h:mm A");
      const year = orderDate.format("YYYY");


      // Count orders by year
      if (!orderCountsByYear[year]) {
        orderCountsByYear[year] = 1;
        totalAmountByYear[year] = order.totalPrice;
      } else {
        orderCountsByYear[year]++;
        totalAmountByYear[year] += order.totalPrice;
      }

      const ordersByYear = Object.keys(orderCountsByYear).map((year) => ({
        _id: year,
        count: orderCountsByYear[year],
      }));
      const amountsByYear = Object.keys(totalAmountByYear).map((year) => ({
        _id: year,
        total: totalAmountByYear[year],
      }));

      ordersByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
      amountsByYear.sort((a, b) => (a._id < b._id ? -1 : 1));

      labelsByCount = ordersByYear.map((entry) => entry._id);
      labelsByAmount = amountsByYear.map((entry) => entry._id);
      dataByCount = ordersByYear.map((entry) => entry.count);
      dataByAmount = amountsByYear.map((entry) => entry.total);

    });
    // console.log("labelsByCount--1", labelsByCount);
    // console.log("labelsByAmount--1", labelsByAmount);
    // console.log("dataByCount--1", dataByCount);
    // console.log("dataByAmount--1", dataByAmount);

    res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });

  } catch (error) {
    console.error("error while chart loading :", error)
  }
}

const getCountMonth = async (req, res) => {
  try {
    const orders = await Orders.find({
      status: {
        $in: ["Delivered"]
      }
    });
    const orderCountsByMonthYear = {};
    const totalAmountByMonthYear = {};
    let labelsByCount;
    let labelsByAmount;
    let dataByCount;
    let dataByAmount;




    orders.forEach((order) => {

      const orderDate = moment(order.orderDate, "ddd, MMM DD, YYYY h:mm A");
      // const dayMonthYear = orderDate.format("YYYY-MM-DD");
      const monthYear = orderDate.format("YYYY-MM");




      // console.log("order.orderDate", order.orderDate);
      // console.log("order.orderDate", orderDate);
      // console.log("dayMonthYear", dayMonthYear);


      if (!orderCountsByMonthYear[monthYear]) {
        orderCountsByMonthYear[monthYear] = 1;
        totalAmountByMonthYear[monthYear] = order.totalPrice;
      } else {
        orderCountsByMonthYear[monthYear]++;
        totalAmountByMonthYear[monthYear] += order.totalPrice;
      }

      const ordersByMonth = Object.keys(orderCountsByMonthYear).map(
        (monthYear) => ({
          _id: monthYear,
          count: orderCountsByMonthYear[monthYear],
        })
      );
      const amountsByMonth = Object.keys(totalAmountByMonthYear).map(
        (monthYear) => ({
          _id: monthYear,
          total: totalAmountByMonthYear[monthYear],
        })
      );


      ordersByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
      amountsByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));

      labelsByCount = ordersByMonth.map((entry) =>
        moment(entry._id, "YYYY-MM").format("MMM YYYY")
      );
      labelsByAmount = amountsByMonth.map((entry) =>
        moment(entry._id, "YYYY-MM").format("MMM YYYY")
      );
      dataByCount = ordersByMonth.map((entry) => entry.count);
      dataByAmount = amountsByMonth.map((entry) => entry.total);

    });
    // console.log("labelsByCount--1", labelsByCount);
    // console.log("labelsByAmount--1", labelsByAmount);
    // console.log("dataByCount--1", dataByCount);
    // console.log("dataByAmount--1", dataByAmount);
    res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });
  } catch (error) {
    console.error("error while chart loading :", error)
  }
}

const getCountDay = async (req, res) => {
  try {
    const orders = await Orders.find({
      status: {
        $in: ["Delivered"]
      }
    });
    const orderCountsByDay = {};
    const totalAmountByDay = {};
    let labelsByCount;
    let labelsByAmount;
    let dataByCount;
    let dataByAmount;
    orders.forEach((order) => {

      const orderDate = moment(order.orderDate, "ddd, MMM DD, YYYY h:mm A");
      const dayMonthYear = orderDate.format("YYYY-MM-DD");
      // console.log("order.orderDate", order.orderDate);
      // console.log("order.orderDate", orderDate);
      // console.log("dayMonthYear", dayMonthYear);


      if (!orderCountsByDay[dayMonthYear]) {
        orderCountsByDay[dayMonthYear] = 1;
        totalAmountByDay[dayMonthYear] = order.totalPrice


      } else {
        orderCountsByDay[dayMonthYear]++;
        totalAmountByDay[dayMonthYear] += order.totalPrice
      }

      const ordersByDay = Object.keys(orderCountsByDay).map(
        (dayMonthYear) => ({
          _id: dayMonthYear,
          count: orderCountsByDay[dayMonthYear],
        })
      );


      const amountsByDay = Object.keys(totalAmountByDay).map(
        (dayMonthYear) => ({
          _id: dayMonthYear,
          total: totalAmountByDay[dayMonthYear],
        })
      );

      // console.log("amountsByDay", amountsByDay);
      // console.log("ordersByDay", ordersByDay);


      amountsByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
      ordersByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
      // console.log("amountsByDay", amountsByDay);
      // console.log("ordersByDay", ordersByDay);


      labelsByCount = ordersByDay.map((entry) =>
        moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
      );

      labelsByAmount = amountsByDay.map((entry) =>
        moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
      );
      // console.log("labelsByCount", labelsByCount);
      // console.log("labelsByAmount", labelsByAmount);
      dataByCount = ordersByDay.map((entry) => entry.count);
      dataByAmount = amountsByDay.map((entry) => entry.total);
      // console.log("dataByCount", dataByCount);
      // console.log("dataByAmount", dataByAmount);
    });

    // console.log("labelsByCount--1", labelsByCount);
    // console.log("labelsByAmount--1", labelsByAmount);
    // console.log("dataByCount--1", dataByCount);
    // console.log("dataByAmount--1", dataByAmount);


    res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });
  } catch (error) {
    console.error("error while chart loading :", error)
  }
}
// ===========================================================================================================================================


module.exports = {
  admin_login_get,
  adminLogin,
  admin_dash,
  logout,
  error_get,
  getCountDay,
  getCountMonth,
  getCountYear
};
