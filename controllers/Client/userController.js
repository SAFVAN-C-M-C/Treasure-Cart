require("passport")
require("../../config/passport")
require("../../config/login-auth")
const bcrypt = require("bcrypt")
const USER = require("../../Models/user")
const { sendOTP } = require("./otpController");
const OTP = require("../../Models/otp");
const Products = require("../../Models/product");
const { ObjectId,Types } = require("mongoose");
const Brands = require("../../Models/brand")
const Categories = require("../../Models/category")
const Wishlist = require("../../Models/wishlist")
const Orders = require("../../Models/order")
const Banner = require("../../Models/banner")
const moment = require("moment");
const { cropImage } = require("../../util/cropImages");



//=================================================================================================================

const home_get = (req, res) => {
    req.session.filter = false;
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
    req.session.filter = false;
    if (req.session.logged) {
        try {
            console.log(req.session.logged);
            const userId = req.session.userid
            const find = await USER.findOne({ email: req.session.email })
            // console.log(find);
            const data = find.userName
            req.session.name = data
            console.log(data);
            // const product=await Products.find({status})
            const product = await Products.aggregate([
                {
                    $match: {
                        status: "Active",
                    },

                }, {
                    $limit: 8,
                }
            ])
            const wishlists = await Wishlist.findOne({ userId: userId });

            let wishlist = wishlists ? wishlists.products : [];

            const best = await Orders.aggregate([
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
                {
                    $match: {
                        "productDetails.status": "Active",
                    },
                },
            ]);

            const banner = await Banner.aggregate([
                {
                    $match: {
                        status: "Active",
                    },
                },
            ]);
            const category = await Categories.find();
            const brand = await Brands.find();
            res.render("./User/home", { title: "Home", user: data, product, wishlist, best, banner, cartCount: req.session.cartCount, category, brand })
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
            const product = await Products.aggregate([
                {
                    $match: {
                        status: "Active",
                    },

                }, {
                    $limit: 8,
                }
            ])
            const wishlist = []
            const best = await Orders.aggregate([
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
                {
                    $match: {
                        "productDetails.status": "Active",
                    },
                },
            ]);
            const banner = await Banner.aggregate([
                {
                    $match: {
                        status: "Active",
                    },
                },
            ]);
            const category = await Categories.find();
            const brand = await Brands.find();
            // console.log();
            res.render("./User/home", { title: "Home", user: data, product, wishlist, best, banner, brand, category })
        } catch (error) {
            console.log(error);
            req.session.err = true
            res.redirect("/404")
        }
    }
}

//=================================================================================================================

const get_Explore = (req, res) => {
    try {
        res.render("./User/explore");
    } catch (err) {
        req.session.err = true
        res.redirect("/404");
        console.log(err);
    }
}

//=================================================================================================================

const get_contactUs = (req, res) => {
    try {
        res.render("./User/contact-us", { cartCount: req.session.cartCount })
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}
//=================================================================================================================
const get_profile = async (req, res) => {
    try {
    req.session.filter = false;
    const user = req.session.name;
        const UserId = req.session.userid;
        const UserData = await USER.findOne({ _id: UserId })
        console.log(UserData);
        // if(UserData.profile.le)
        //console.log(UserData.dob);  
        res.render("./User/profile", { user, UserData, cartCount: req.session.cartCount })
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}

//=================================================================================================================
const get_manageAddress = async (req, res) => {
    try {
    req.session.filter = false;
    const user = req.session.name;
        const UserId = req.session.userid;
        const UserData = await USER.findOne({ _id: UserId })
        const address = UserData.address;
        // console.log(address);
        res.render("./User/address-manage", { user, UserData, address, cartCount: req.session.cartCount })
    } catch (err) {
        req.session.err = true
        res.redirect("/404")
        console.log(err);
    }
}

// =============================================================================
const addAddress = async (req, res) => {
    try {
        const userId = req.session.userid
        const data = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            mobile: req.body.mobile,
        }
        console.log(req.body);
        await USER.updateOne({ _id: userId }, { $push: { address: data } })
        res.json({ success: true })
    } catch (err) {
        console.log(err);
        res.json({ success: false })
    }
}
const editAddress = async (req, res) => {
    try {
        console.log("here", req.body);

        const userId = req.session.userid
        const address_id = req.body.address_id
        const data = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            mobile: req.body.mobile,
        }
        console.log(req.body);
        await USER.findOneAndUpdate(
            { _id: userId, 'address._id': address_id },
            { $set: { 'address.$': data } },
            { new: true }).exec()
            .then(user => {
                console.log('User with updated address:', user);
                res.json({ success: true })
            })
            .catch(err => {
                console.error('Error deleting address:', err);
                res.json({ success: false })

            });


    } catch (err) {
        console.log(err);
        res.json({ success: false })
    }
}
const deleteAddress = async (req, res) => {
    try {
        const userId = req.session.userid
        const addressId = req.body.addressId

        await USER.findOneAndUpdate(
            { _id: userId },
            { $pull: { address: { _id: addressId } } },
            { new: true }
        )
            .exec()
            .then(user => {
                console.log('User with deleted address:', user);
                res.json({ success: true })

            })
            .catch(err => {
                console.error('Error deleting address:', err);
                res.json({ success: false })

            });

    } catch (err) {
        console.log(err);
        res.json({ success: false })
    }
}
// ============================================================================
const addAddressCheckout = async (req, res) => {
    try {
        const userId = req.session.userid
        const data = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            mobile: req.body.mobile,
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
                status: "Active",
                profile:[{
                    mainimage:"/static/images/img-bg.jpg"
                }],
                
            }
            const result = await USER.insertMany([data])
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
                    res.json({ faild: true, msg: "user blocked" });
                    console.log("user blocked");
                }
            }
            else {
                res.json({ faild: true, msg: "invalid password" });
                console.log("invalid password");
            }
        } else {
            res.json({ faild: true, msg: "User not found" });
            console.log("User not found");

        }
    } catch {
        res.json({ faild: true, msg: "uinvalid user name or password" });
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
            
            
            const Otp = await OTP.findOne({ email: req.session.email })
            console.log(Otp.expireAt);
            if (Date.now() > Otp.expiredAt) {
                await OTP.deleteOne({ email });
            } else {
                const hashed = Otp.otp
                const match = await bcrypt.compare(req.body.code, hashed);
                if (match) {
                    const user = await USER.findOne({email:req.session.email})
                    user.veified=true;
                    user.timeStamp= Date.now()
                    user.save();
                    req.session.logged = true;
                    req.session.signotp = false
                    req.session.userid=user._id;
                    res.redirect("/")

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
            res.redirect('/login');
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
        await USER.updateOne({ email: email }, { $set: { password: pass } })
        const user = await USER.findOne({ email: email });
        req.session.userid = user._id
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
        res.redirect("/");
    }
}

//=================================================================================================================

//set checkout
const setCheckout = (req, res) => {
    req.session.checkout = true;
    req.session.discount_price=0
    res.redirect("/checkout");
}
//get check out
const getcheckout = async (req, res) => {
    try {
        const userId = req.session.userid
        const user = req.session.name
        const data = await USER.findOne({ _id: userId })
        const Address = data.address;
        const gstAmount = req.session.gstAmount
        const subtotal = req.session.subTotal
        const totalAmount = req.session.totalAmount
        const totalQuantity = req.session.totalQuantity;
        console.log(totalQuantity);
        res.render("./User/newCheckout", { user, Address, cartCount: req.session.cartCount, gstAmount, subtotal, total:totalAmount, expectedDeliveryDate: moment().add(7, "days").format("ddd, MMM D, YYYY") ,totalQuantity,discount:req.session.discount_price?Math.abs(req.session.discount_price):0});
    } catch (err) {
        console.log("erroor in checkout:::",err);
    }
}




const edit_profile = async (req, res) => {
    try {
        const userId = req.session.userid
        const main = req.files["main"][0];
        const images=[main.key];
        cropImage(images)
        const {
            name,
            email,
            phone,
            dob
        } = req.body;
        const data = {
            userName: name,
            email: email,
            phone: phone,
            dob: dob,
            profile: [{
                mainimage: main.location,
            }],
        };
        await USER.updateOne({ _id: new Types.ObjectId(userId) }, { $set: data });
        res.redirect("/profile");
    } catch (err) {
        console.log(err);
        res.redirect("/profile")

    }
}
const about=(req,res)=>{
    req.session.filter = false;

    const user=req.session.name
    res.render("./User/About",{user,cartCount:req.session.cartCount})
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
    setCheckout,
    addAddressCheckout,
    deleteAddress,
    editAddress,
    about
}