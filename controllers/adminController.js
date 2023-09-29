const ADMIN = require("../Models/superAdmin")
const bcrypt = require("bcrypt");
//Email: 'safvancmc3@gmail.com'
// email:'safvancmc3@gmail.com'
const adminLogin = async (req, res) => {
    try {
        const check = await ADMIN.findOne({Email:req.body.email})
        console.log(check);
        console.log(check.Password);
        console.log(check.Email);
        console.log(req.body);
        const hashed=check.Password;
        const pass=req.body.password;
        console.log("hashed",hashed);
        console.log("pass",pass);
        let isMatch = await bcrypt.compare(pass,hashed, (err, result)=>{
                if (err) {
                    console.log(err);
                } else if (result) {
                    req.session.name = check.name;
                    req.session.Adminlogged = true;
                    req.session.Name = check.UserName;
                    console.log("Login success");
                    res.redirect("/admin/Dashbord");
                }
                else {
                    req.session.errmsg = "invalid password"
                    res.redirect('/admin/login')
                    console.log("invalid password");
                }
            }
        );
    } catch (err) {
        req.session.errmsg = "user not found"
        res.redirect('/')
        console.log("user not found", err);
    }
}


module.exports = {
    adminLogin
}