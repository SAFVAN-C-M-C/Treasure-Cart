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
const Users = require("../../Models/user")
const Cart = require("../../Models/cart")
const CART = require("../../Models/cart")
const user = require("../../routers/userRoutes")
const Orders = require("../../Models/oreder")

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
    // if (req.session.signotp || req.session.forgot) {
    res.render("./User/otp");
    // } else {
    //     res.redirect("/user/logout")
    // }
}
//=================================================================================================================


const forgot_password_page = (req, res) => {
    // if (req.session.logged) {
    //     res.redirect('/user/home');
    // } else {
    req.session.forgot = true
    res.render("./User/forgot-pass", { errmsg: req.flash("errmsg") })
    // }
}

//=================================================================================================================

const home_logged = async (req, res) => {
    // if (req.session.logged || req.user) {
    console.log(req.session.logged);
    const find = await USER.findOne({ email: req.session.email })
    console.log(find);
    const data = find.userName
    req.session.name = data
    console.log(data);
    res.render("./User/home", { title: "Home", user: data })
}
// else {
//     console.log(req.session.logged);
//     res.redirect("/user/logout")
// }


//=================================================================================================================

const get_product_details = async (req, res) => {
    // if (req.session.logged) {
    try {
        const id = req.params.id;
        const data = await Products.findOne({ _id: new ObjectId(id) });
        console.log(data);
        const brandId = data.brandId
        const brand = await Brands.findOne({ _id: brandId })
        console.log(brandId);
        console.log(brand);
        const categoryId = data.categoryId
        console.log(categoryId);
        const category = await Categories.findOne({ _id: categoryId })
        console.log(category);
        const user = req.session.name ? req.session.name : "User"
        res.render("./User/product-detail", { data, user, brand, category });
        //   res.render("./User/product-sample",{data});
    } catch (err) {
        console.log(err)
        req.session.err = true
        res.redirect("/user/404")

    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}

//=================================================================================================================

const get_product = async (req, res) => {
    // if (req.session.logged) {
    try {

        const products = await Products.find();
        console.log(products);
        const data = req.session.name
        res.render("./User/products", { title: "products", products: products, user: data })
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}

//=================================================================================================================

const get_Explore = (req, res) => {
    // if (req.session.logged) {
    try {
        res.render("./User/explore");
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}
//=================================================================================================================



//=================================================================================================================

const get_contactUs = (req, res) => {
    // if (req.session.logged) {
    try {
        res.render("./User/contact-us")
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}
//=================================================================================================================
const get_profile = async(req, res) => {
    // if (req.session.logged) {
    try {
        const user=req.session.name;
        const UserId=req.session.userid;
        const UserData=await USER.findOne({_id:UserId})
        console.log(UserData.dob);
        res.render("./User/profile",{user,UserData})
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}
//=================================================================================================================

const get_wishlist = (req, res) => {
    // if (req.session.logged) {
    try {
        const data = req.session.name
        res.render("./User/user-wishlist", { user: data })
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}

//=================================================================================================================
const get_manageAddress = async(req, res) => {
    // if (req.session.logged) {
    try {
        const user=req.session.name;
        const UserId=req.session.userid;
        const UserData=await USER.findOne({_id:UserId})
        const address=UserData.address;
        console.log(address);
        res.render("./User/address-manage",{user,UserData,address})
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}

// ===================================================
const addAddress=async(req,res)=>{
    try{
        const userId=req.session.userid
        const {
            name,
            address,
            city,
            pincode,
            state,
            mobile
        }=req.body;
        console.log(req.body);
        const insert=await USER.updateOne({_id:userId},{$push:{address:req.body}})
        res.redirect('/user/manage-address')
    }catch(err){
        console.log(err);
        res.redirect('/user/manage-address')

    }
}
//=================================================================================================================
const get_order = (req, res) => {
    // if (req.session.logged) {
    try {
        res.render("./User/orders")
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
}
//=================================================================================================================
const get_history = (req, res) => {
    // if (req.session.logged) {
    try {
        res.render("./User/history");
    } catch (err) {
        req.session.err = true
        res.redirect("/user/404")
        console.log(err);
    }
    // } else {
    //     res.redirect("/user/logout")
    // }
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
    // if (req.session.signotp || req.session.forgot) {
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
    // }
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
                    req.session.email = check.email;
                    req.session.userid = check._id;
                    req.session.logged = true;
                    console.log("Login success");
                    res.redirect("/user/home");
                } else {
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
                    req.session.pass_reset = true
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
const get_password_reset = (req, res) => {
    // if (req.session.pass_reset) {
    res.render("./User/password-reset");

    // } else {
    //     res.redirect("/user/logout")
    // }
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
        res.redirect("/user/home")
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
        res.redirect("/user/logout");
    }
}
//=================================================================================================================


//get check out
const getcheckout=async(req,res)=>{
    try{
        const userId=req.session.userid
        const user =req.session.name
        const data=await USER.findOne({_id:userId})
        const Address=data.address;
        console.log(Address);
        res.render("./User/checkout",{user,Address});
    }catch(err){
        console.log(err);
    }
}
const postCheckout=async(req,res)=>{
    try{
        console.log("inside body", req.body);
        // const PaymentMethod = req.body.paymentMethod;
        // const Address = req.body.Address;
        const userId = req.session.userid;
        const amount = req.session.totalAmount;
        const user = await USER.findById(userId);
        const Email = user.email;
        const {
            Address,
            PaymentMethod
        }=req.body
        const cart = await Cart.findOne({ UserId: userId }).populate(
          "products.productId"
        );
        console.log(req.session.totalPrice);
    
        const newOrders = new Orders({
            userId: userId,
            items: cart.products,
            orederDate: moment(new Date()).format("llll"),
          expectedDeliveryDate: moment().add(7, "days").format("llll"),
          totalPrice: amount,
          address: Address,
          payMethod: PaymentMethod,
        });
        //delete the items in the cart after checkout
        await Cart.findByIdAndDelete(cart._id);
        //save order to database
        const order = await newOrders.save();
        console.log(order, "in orders");
        req.session.orderId = order._id;
    
        for (const item of order.items) {
          const productId = item.productId;
          const quantity = item.quantity;
    
          const product = await Products.findById(productId);
    
          if (product) {
            const updatedQuantity = product.stock - quantity;
    
            if (updatedQuantity < 0) {
              product.stock = 0;
            //   product.Status = "Out of Stock";
            } else {
              // Update the product's available quantity
              product.stock = updatedQuantity;
    
              // Save the updated product back to the database
              await product.save();
            }
          }
        }
        if (PaymentMethod === "cod") {
          //send email with details of orders
          const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
              user: "tickerpage@gmail.com",
              pass: "vfte pvyn gvat uylk",
            },
            secure: true,
          });
          const mailData = {
            from: "tickerpage@gmail.com",
            to: Email,
            subject: "Your Orders!",
            text:
              `Hello! ${user.Username} Your order has been received and will be processed within one business day.` +
              ` your total price is ${req.session.totalPrice}`,
          };
          transporter.sendMail(mailData, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Success");
          });
          res.json({ codSuccess: true });
        } else {
          console.log("hereeeeeee");
          const order = {
            amount: amount,
            currency: "INR",
            receipt: req.session.orderId,
          };
          await razorpay
            .createRazorpayOrder(order)
            .then((createdOrder) => {
              console.log("payment response", createdOrder);
              res.json({ createdOrder, order });
            })
            .catch((err) => {
              console.log(err);
            });
        }
    }catch(err){
        console.log(err);
    }
}


const edit_profile=async(req,res)=>{
    try{
        const userId=req.session.userid
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
            email:email,
            phone:phone,
            dob:dob,
            profile: [{
                mainimage: main.filename,
            }],
        };
        await USER.updateOne({ _id: new ObjectId(userId) }, { $set: data });
        res.redirect("/user/profile");
    }catch(err){
        console.log(err);
        res.redirect("/user/profile")

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
    // get_cart,
    get_password_reset,
    password_reset,
    error_get,
    getcheckout,
    edit_profile,
    addAddress,
    postCheckout
    // addTocart,
}