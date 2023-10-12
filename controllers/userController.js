require("../util/otpindex")
const passport=require("passport")
const bcrypt=require("bcrypt")
require("../config/passport")
require("../config/login-auth")
const USER=require("../Models/user")
const {sendOTP}=require("../controllers/otpController");
const OTP = require("../Models/otp");
const Products = require("../Models/product");
const { ObjectId } = require('mongodb')
//=================================================================================================================

const home_get=(req,res)=>{
    if(req.session.logged){
        res.redirect('/user/home');
    }else{
        res.render("./User/index",{title:"Login",errmsg:req.flash("errmsg")});
    }
}
//=================================================================================================================

const userSignup_get=(req,res)=>{
    if(req.session.logged){
        res.redirect('/user/home');
    }else{
    res.render("./User/Signup",{title:"Signup",errmsg:req.flash("errmsg")})
    }
}
//=================================================================================================================

const otp_page=(req,res)=>{
    if (req.session.signotp || req.session.forgot) {
    res.render("./User/otp");
    }else{
        res.redirect("/")
    }
}
//=================================================================================================================


const forgot_password_page=(req,res)=>{
    if(req.session.logged){
        res.redirect('/user/home');
    }else{
    req.session.forgot=true
    res.render("./User/forgot-pass",{errmsg:req.flash("errmsg")})
    }
}

//=================================================================================================================

const home_logged=async(req,res)=>{
    if(req.session.logged||req.user){
        console.log(req.session.logged);
        const find=await USER.findOne({email:req.session.email})
        console.log(find);
      const data=find.userName
      req.session.name=data
      console.log(data);
        res.render("./User/home",{title:"Home",user:data})
    }
    else{
        console.log(req.session.logged);
        res.redirect("/")
    }
}

//=================================================================================================================

const get_product_details=async(req,res)=>{
    // if(req.session.admin){
      const id=req.params.id;
  const data = await Products.findOne({ _id: new ObjectId(id) });
  res.render("./User/product-detail",{data});
  // }else{
  //     res.redirect('/admin')
  // }
    
  }

//=================================================================================================================

  const get_product=async(req,res)=>{
    // if(req.session.logged){
        const products=await Products.find();
        console.log(products);
        const data=req.session.name
        res.render("./User/products",{title:"products",products:products,user:data})
    // }
    // else{
    //     res.redirect("/")
    // }
}

//=================================================================================================================

const get_Explore=(req,res)=>{
    res.render("./User/explore");
  }
//=================================================================================================================
const get_cart=(req,res)=>{
    res.render("./User/cart")
  }


//=================================================================================================================

const get_contactUs=(req,res)=>{
    res.render("./User/contact-us")
  }
//=================================================================================================================
const get_profile=(req,res)=>{
    res.render("./User/profile")
  }
//=================================================================================================================

const get_wishlist =(req,res)=>{
    const data=req.session.name
    res.render("./User/user-wishlist",{user:data})
  }

//=================================================================================================================
  const get_manageAddress=(req,res)=>{
    res.render("./User/address-manage")
  }
//=================================================================================================================
  const get_order=(req,res)=>{
    res.render("./User/orders")
  }
//=================================================================================================================
const get_history=(req,res)=>{
    res.render("./User/history");
  }

//=================================================================================================================


const userSignup = async (req, res) => {
    console.log("user sign up");
    console.log(req.body);
    try {
        const check = await USER.find({ email: req.body.email })
        console.log(typeof (check));
        if (check.length == 0) {
            const pass = await bcrypt.hash(req.body.password, 10);
            const data = {
                userName: req.body.name,
                email: req.body.email,
                password: pass,
            }
            req.session.data = data;
            req.session.email = data.email
            req.session.signotp = true;
            res.redirect("/user/otp-sent");
        } else {
            req.flash("errmsg", "*User with this email Already exist")
            req.session.errmsg = "user already exist"
            res.redirect('/user/signup')
            console.log("user already exist");
        }
    } catch (e) {
        console.log(e);
        req.flash("errmsg", "Sorry!!Something went wrong please try again after some times!!")
        req.session.errmsg = "something went wrong"
        res.redirect('/user/signup')
        console.log("user already exist");
    }
}

//=================================================================================================================


const otpSender = async (req, res) => {
    if (req.session.signotp || req.session.forgot) {
        try {
            console.log(req.session.email);
            console.log("otp route");
            const email = req.session.email;
            console.log(email);
            console.log(sendOTP);
            const createdOTP = await sendOTP(email)
            req.session.email = email;
            console.log("session before verifiying otp :", req.session.email);
            res.status(200).redirect("/User/otp")
        } catch (err) {
            console.log(err);
            req.session.errmsg = "Sorry at this momment we can't sent otp";
            console.log(req.session.errmsg);
            if (req.session.forgot) {
                res.redirect("/user/forgot-pass")
            }
            res.redirect("/user/SignUp");
        }
    }
}

//=================================================================================================================


const forgotPass = async (req, res) => {
    try {
        console.log(req.body);
        const check = await USER.findOne({ email: req.body.email })
        if (check) {
            console.log("good to go:", check);
            const userdata = {
                email: check.email,
                userName: check.userName,
                _id: check._id,
            }
            const email = req.body.email
            console.log("Email::: ", email);
            req.session.userdata = userdata;
            req.session.email = email.toString();
            console.log("Sessiosiiii: ", req.session.email)
            res.redirect("/user/otp-sent")
        }
        else {
            console.log(check);
            req.flash("errmsg", "*no acounts found in this email")
            req.session.errmsg = "no email found"
            res.redirect("/user/forgot-pass");
        }
    } catch (err) {
        console.log(err);
        req.session.errmsg = "no email found"
        res.redirect("/user/forgot-pass")
    }

}

//=================================================================================================================


const userLogin = async (req, res) => {
    try {
        const check = await USER.findOne({ email: req.body.email })
        console.log(check);
        if (check) {
            console.log(req.body);
            let isMatch = await bcrypt.compare(
                req.body.password,
                check.password
            );
            if (isMatch) {
                if (check.status === "Active") {
                    req.session.name = check.name;
                    req.session.email = check.email
                    req.session.logged = true;
                    console.log("Login success");
                    res.redirect("/user/home");
                }else{
                    req.flash("errmsg", "*user blocked")

                    req.session.errmsg = "user blocked"
                    res.redirect('/')
                    console.log("user blocked");
                }
            }
            else {
                req.flash("errmsg", "*invalid password")

                req.session.errmsg = "invalid password"
                res.redirect('/')
                console.log("invalid password");
            }
        } else {
            req.flash("errmsg", "*User not found")
            res.redirect('/')
            req.session.errmsg = "User not found"
            console.log("User not found");

        }
    } catch {
        req.flash("errmsg", "*invalid user name or password")
        req.session.errmsg = "invalid user name or password"
        res.redirect('/')
        console.log("user not found");
    }
}

//=================================================================================================================

// otp verification
const OtpConfirmation = async (req, res) => {
    if (req.session.forgot) {
        console.log(req.body);
        try {
            const email = req.session.email
            console.log("forgot confirmation :", email);
            const Otp = await OTP.findOne({ email: email })

            if (Date.now() > Otp.expireAt) {
                await OTP.deleteOne({ data });

            } else {
                const hashed = Otp.otp
                const match = await bcrypt.compare(req.body.code, hashed);
                if (match) {
                    // req.session.logged = true;
                    req.session.forgot = false;
                    req.session.pass_reset=true
                    res.redirect("/user/password/reset");
                }
                else {
                    console.log("no match");
                    req.session.userdata = "";
                    req.session.errmsg = "Invalid OTP"
                    res.redirect("/user/otp")
                }
            }
        } catch (err) {
            console.log(err);
            req.session.errmsg = "Email not found";
        }
    }
    else if (req.session.signotp) {
        console.log(req.body)
        try {
            const data = req.session.data;
            const dataplus = {
                userName: data.userName,
                email: data.email,
                password: data.password,
                status: "Active",
                timeStamp: Date.now()
            }
            console.log(req.session.data);
            const Otp = await OTP.findOne({ email: data.email })
            console.log(Otp.expireAt);
            if (Date.now() > Otp.expiredAt) {
                await OTP.deleteOne({ email });
            } else {
                const hashed = Otp.otp
                const match = await bcrypt.compare(req.body.code, hashed);
                if (match) {
                    const result = await USER.insertMany([dataplus])
                    req.session.logged = true;
                    req.session.signotp = false
                    req.session.email = dataplus.email
                    res.redirect("/user/home")

                }
                else {
                    req.session.errmsg = "Invalid OTP"
                    res.redirect("/user/otp")
                }
            }


        } catch (err) {
            console.log(err);
            res.redirect("/user/otp")
        }
    }
}
//==================================================================================

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
}
//==================================================================================
const get_password_reset=(req,res)=>{
    if(req.session.pass_reset){
        res.render("./User/password-reset");

    }else{
        res.redirect("/")
    }
}

//=================================================================================================================
const password_reset=async(req,res)=>{
    try{
        console.log(req.body);
        const pass = await bcrypt.hash(req.body.password, 10);
        const email=req.session.email
        console.log(email);
        const update=await USER.updateOne({email:email},{ $set: {password:pass} })
        req.session.logged = true;
        req.session.pass_reset=false
        res.redirect("/user/home")
    }catch(err){
        req.flash("errmsg", "something went wrong")
        console.log(err);
    }
}

module.exports = {
    home_get,
    userLogin,
    userSignup_get,
    userSignup,
    forgotPass,
    otpSender,
    logout,
    OtpConfirmation,
    otp_page,
    forgot_password_page,
    home_logged,
    get_product_details,
    get_product,
    get_contactUs,
    get_profile,
    get_wishlist,
    get_wishlist,
    get_manageAddress,
    get_order,
    get_history,
    get_Explore,
    get_cart,
    get_password_reset,
    password_reset,
}