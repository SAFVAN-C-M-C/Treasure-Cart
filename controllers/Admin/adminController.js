const ADMIN = require("../../Models/superAdmin");
const bcrypt = require("bcrypt");


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
    console.log(check);
    console.log(check.password);
    console.log(check.email);
    console.log(req.body);
    const hashed = check.password;
    const pass = req.body.password;
    console.log("hashed", hashed);
    console.log("pass", pass);
    let isMatch = await bcrypt.compare(pass, hashed, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result) {
        // req.session.name = check.name;
        req.session.Adminlogged = true;
        req.session.Name = check.userName;
        console.log("Login success");
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

const admin_dash = (req, res) => {
  // if (req.session.admin) {
    try{
        res.render("./Admin/Admin-dash");
    }catch(err){
      res.render.err=true
      res.redirect("/admin/404");
    }
  // } else {
  //   res.redirect("/admin/logout");
  // }
};

// ===========================================================================================================================================

const logout=(req,res)=>{
  req.session.destroy((err) => {
    if (err) {
        console.log(err);
        res.send('Error');
    } else {
        res.redirect('/admin');
    }
});}
// ===========================================================================================================================================

const error_get=(req,res)=>{
  // if(req.session.err){
    res.render("./Errors/404");
  // }
  // else{
  //   res.redirect("/admin/logout");
  // }
}
// ===========================================================================================================================================

module.exports = {
  admin_login_get,
  adminLogin,
  admin_dash,
  logout,
  error_get,
};
