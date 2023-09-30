const user = require("../Models/user")
const bcrypt = require("bcrypt");
const sendOTP = require("./otpController");
const { use } = require("../routers/adminRoutes");
require("../util/otpindex")
const OTP = require("../Models/otp");


const userSignup = async (req,res) => {
    console.log(req.body);
    try {
        const check = await user.find({ Email: req.body.email })
        console.log(typeof (check));
        if (check.length == 0) {
            const pass = await bcrypt.hash(req.body.password, 10);
            const data = {
                UserName: req.body.name,
                Email: req.body.email,
                Password: pass,
            }
            req.session.data = data;
            req.session.email = data.Email
            res.redirect("/user/otp-sent");
        } else {
            req.session.errmsgsign = "user already exist"
            res.redirect('/user/signup')
            console.log("user already exist");
        }
    } catch (e) {
        console.log(e);
    }
}


const otpSender = async(req,res)=>{
    try{
        console.log("otp route");
        const email=req.session.email;
        console.log(email.email);
        const createdOTP=await sendOTP(email.email)
        res.status(200).redirect("/User/otp")
    }catch(err){
        console.log(err);
        req.session.errmsg="Sorry at this momment we can't sent otp";
        if(req.session.forgot){
            res.redirect("/user/forgot-pass")
        }
        res.redirect("/user/SignUp");
    }
}



const forgotPass = async (req, res) => {
    try{
        console.log(req.body);
        const check=await user.findOne({Email:req.body.email})
        if(check.length > 0){
            console.log(check);
            req.session.email=req.body;
           res.redirect("/user/otp-sent") 
        }
        else{
            console.log(check);
            req.session.errmsg="no email found"
            res.redirect("/user/forgot-pass");
        }
    }catch(err){
        console.log(err);
        req.session.errmsg="no email found"
        res.redirect("/user/forgot-pass")
    }

}

const forgotPassOTPConfirmation= async (req,res) => {
    console.log(req.body);
    try{
        const data=req.session.email
        console.log(data);
        const Otp= await OTP.findOne({email:data})

        if(Date.now()>Otp,expireAt){
            await OTP.deleteOne({data});

        }else{
            const hashed=Otp.otp
            const match=await bcrypt.compare(req.body.code,hashed);
            if(match){
                res.redirect("/user/home");
            }
            else{
                req.session.errmsg="Invalid OTP"
            }
        }
    }catch(err){
        console.log(err);
        req.session.errmsg="Email not found";
    }
}

const userLogin = async (req, res) => {
    try {
        const check = await user.findOne({ Email: req.body.email })
        console.log(check);
        console.log(req.body);
        let isMatch = await bcrypt.compare(
            req.body.password,
            check.Password
        );
        if (isMatch) {
            req.session.name = check.name;
            req.session.logged = true;
            console.log("Login success");
            res.redirect("/user/home");
        }
        else {
            req.session.errmsg = "invalid password"
            res.redirect('/')
            console.log("invalid password");
        }
    } catch {
        req.session.errmsg = "user not found"
        res.redirect('/')
        console.log("user not found");
    }
}

//sign up otp verification
const signUpOtpConfirmation = async (req,res) => {
    console.log(req.body)
    try{
        const data =req.session.data;
        console.log(req.session.data);
        const Otp= await OTP.findOne({email:data.Email})
        console.log(Otp.expireAt);
        if(Date.now()>Otp.expiredAt){
            await OTP.deleteOne({email});
        }else{
            const hashed=Otp.otp
            const match=await bcrypt.compare(req.body.code,hashed);
            if(match){
                const result=await USER.insertMany([data])
                req.session.logged=true;
                res.redirect("/user/home")

            }
            else{
                req.session.errmsg="Invalid OTP"
                res.redirect("/user/otp")
            }
        }
        
        
    }catch(err){
        console.log(err);
        res.redirect("/user/otp")
    }
}

const logout = (req,res) => {
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.send('Error');
        }else{
            res.redirect('/');
        }
    });
}

module.exports = {
    userLogin,
    userSignup,
    forgotPass,
    otpSender,
    forgotPassOTPConfirmation,
    logout,
    signUpOtpConfirmation

}