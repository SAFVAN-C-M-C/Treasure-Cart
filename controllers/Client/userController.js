require("../../util/otpindex")
require("passport")
require("../../config/passport")
require("../../config/login-auth")
const bcrypt = require("bcrypt")
const USER = require("../../Models/user")
const { sendOTP } = require("./otpController");
const OTP = require("../../Models/otp");
const Products = require("../../Models/product");
const { ObjectId } = require('mongodb')
const Brands = require("../../Models/brand")
const Categories = require("../../Models/category")
const Wishlist = require("../../Models/wishlist")




//=================================================================================================================

const home_get = (req, res) => {

    res.render("./User/index", { title: "Login", errmsg: req.flash("errmsg") });

}
//=================================================================================================================

const userSignup_get = (req, res) => {
    res.render("./User/Signup", { title: "Signup", errmsg: req.flash("errmsg") })
}
//=================================================================================================================

const otp_page = (req, res) => {
    res.render("./User/otp");
}
//=================================================================================================================


const forgot_password_page = (req, res) => {
    req.session.forgot = true
    res.render("./User/forgot-pass", { errmsg: req.flash("errmsg") })
}

//=================================================================================================================

const home_logged = async (req, res) => {
    if (req.session.logged) {
        try {
            console.log(req.session.logged);
            const userId=req.session.userid
            const find = await USER.findOne({ email: req.session.email })
            // console.log(find);
            const data = find.userName
            req.session.name = data
            console.log(data);
            const product=await Products.find()
            const wishlists = await Wishlist.findOne({ userId: userId }).populate('products.productId');
            const wishlist=wishlists.products
            res.render("./User/home", { title: "Home", user: data,product,wishlist,logged:true })
        } catch (error) {
            console.log(error);
            req.session.err = true
            res.redirect("/404")
        }
      } else {
        try {
            console.log(req.session.logged);
            const data = null
            req.session.name = data
            console.log(data);
            const product=await Products.find()
            const wishlist=[]
            res.render("./User/home", { title: "Home", user: data,product,wishlist,logged:false })
        } catch (error) {
            console.log(error);
            req.session.err = true
            res.redirect("/404")
        }
      }
    }




//=================================================================================================================



//=================================================================================================================



//=================================================================================================================

const get_Explore = (req, res) => {
    try {
        res.render("./User/explore");
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}
//=================================================================================================================



//=================================================================================================================

const get_contactUs = (req, res) => {
    try {
        res.render("./User/contact-us")
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}
//=================================================================================================================
const get_profile = async (req, res) => {
    try {
        const user = req.session.name;
        const UserId = req.session.userid;
        const UserData = await USER.findOne({ _id: UserId })
        console.log(UserData.dob);
        res.render("./User/profile", { user, UserData })
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}
//=================================================================================================================



//=================================================================================================================
const get_manageAddress = async (req, res) => {
    try {
        const user = req.session.name;
        const UserId = req.session.userid;
        const UserData = await USER.findOne({ _id: UserId })
        const address = UserData.address;
        console.log(address);
        res.render("./User/address-manage", { user, UserData, address })
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}

// ===================================================
const addAddress = async (req, res) => {
    try {
        const userId = req.session.userid
        const data={
            name:req.body.name,
            address:req.body.address,
            city:req.body.city,
            pincode:req.body.pincode,
            state:req.body.state,
            mobile:req.body.mobile,
        }
        console.log(req.body);
        const insert = await USER.updateOne({ _id: userId }, { $push: { address: data } })
        res.redirect('/manage-address')
    } catch (err) {
        console.log(err);
        res.redirect('/manage-address')

    }
}
// ===================================================
const addAddressCheckout = async (req, res) => {
    try {
        const userId = req.session.userid
        const data={
            name:req.body.name,
            address:req.body.address,
            city:req.body.city,
            pincode:req.body.pincode,
            state:req.body.state,
            mobile:req.body.mobile,
        }
        console.log(req.body);
        const insert = await USER.updateOne({ _id: userId }, { $push: { address: data } })
        res.redirect('/checkout')
    } catch (err) {
        console.log(err);
        res.redirect('/checkout')

    }
}
//=================================================================================================================
const get_order = (req, res) => {
    try {
        res.render("./User/orders")
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}
//=================================================================================================================
const get_history = (req, res) => {
    try {
        res.render("./User/history");
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
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
            res.redirect("/otp-sent");
        } else {
            req.flash("errmsg", "*User with this email Already exist")
            req.session.errmsg = "user already exist"
            res.redirect('/signup')
            console.log("user already exist");
        }
    } catch (e) {
        console.log(e);
        req.flash("errmsg", "Sorry!!Something went wrong please try again after some times!!")
        req.session.errmsg = "something went wrong"
        res.redirect('/signup')
        console.log("user already exist");
    }
}

//=================================================================================================================


const otpSender = async (req, res) => {
    try {
        console.log(req.session.email);
        console.log("otp route");
        const email = req.session.email;
        console.log(email);
        console.log(sendOTP);
        const createdOTP = await sendOTP(email)
        req.session.email = email;
        console.log("session before verifiying otp :", req.session.email);
        res.status(200).redirect("/otp")
    } catch (err) {
        console.log(err);
        req.session.errmsg = "Sorry at this momment we can't sent otp";
        console.log(req.session.errmsg);
        if (req.session.forgot) {
            res.redirect("/forgot-pass")
        }
        res.redirect("/SignUp");
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
            res.redirect("/otp-sent")
        }
        else {
            console.log(check);
            req.flash("errmsg", "*no acounts found in this email")
            req.session.errmsg = "no email found"
            res.redirect("/forgot-pass");
        }
    } catch (err) {
        console.log(err);
        req.session.errmsg = "no email found"
        res.redirect("/forgot-pass")
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
                    req.session.email = check.email;
                    req.session.userid = check._id;
                    req.session.logged = true;
                    console.log("Login success");
                    res.redirect("/");
                } else {
                    res.json({ faild: true,msg:"user blocked" });
                    console.log("user blocked");
                }
            }
            else {
                res.json({ faild: true,msg:"invalid password" });
                console.log("invalid password");
            }
        } else {
            res.json({ faild: true,msg:"User not found" });
            console.log("User not found");

        }
    } catch {
        res.json({ faild: true,msg:"uinvalid user name or password" });
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
                    req.session.pass_reset = true
                    res.redirect("/password/reset");
                }
                else {
                    console.log("no match");
                    req.session.userdata = "";
                    req.session.errmsg = "Invalid OTP"
                    res.redirect("/otp")
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
                    res.redirect("/home")

                }
                else {
                    req.session.errmsg = "Invalid OTP"
                    res.redirect("/otp")
                }
            }
        } catch (err) {
            console.log(err);
            res.redirect("/otp")
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
const get_password_reset = (req, res) => {
    res.render("./User/password-reset");
}

//=================================================================================================================
const password_reset = async (req, res) => {
    try {
        console.log(req.body);
        const pass = await bcrypt.hash(req.body.password, 10);
        const email = req.session.email
        console.log(email);
        const update = await USER.updateOne({ email: email }, { $set: { password: pass } })
        req.session.logged = true;
        req.session.pass_reset = false
        res.redirect("/")
    } catch (err) {
        req.flash("errmsg", "something went wrong")
        console.log(err);
    }
}
const error_get = (req, res) => {
    if (req.session.err) {
        res.render("./Errors/404");
    }
    else {
        res.redirect("/logout");
    }
}
//=================================================================================================================


//get check out
const getcheckout = async (req, res) => {
    try {
        const userId = req.session.userid
        const user = req.session.name
        const data = await USER.findOne({ _id: userId })
        const Address = data.address;
        console.log(Address);
        res.render("./User/checkout", { user, Address });
    } catch (err) {
        console.log(err);
    }
}




const edit_profile = async (req, res) => {
    try {
        const userId = req.session.userid
        console.log("hello it here on the edit post");
        const main = req.files["main"][0];

        // Do whatever you want with these files.
        console.log("Uploaded files:");
        console.log(main);
        console.log(req.body);


        const {
            name,
            email,
            phone,
            dob
        } = req.body;

        console.log("name is " + name);
        const data = {
            userName: name,
            email: email,
            phone: phone,
            dob: dob,
            profile: [{
                mainimage: main.filename,
            }],
        };
        await USER.updateOne({ _id: new ObjectId(userId) }, { $set: data });
        res.redirect("/profile");
    } catch (err) {
        console.log(err);
        res.redirect("/profile")

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
    // get_product_details,
    // get_product,
    get_contactUs,
    get_profile,
    
    get_manageAddress,
    get_order,
    get_history,
    get_Explore,
    get_password_reset,
    password_reset,
    error_get,
    getcheckout,
    edit_profile,
    addAddress,
    addAddressCheckout
}