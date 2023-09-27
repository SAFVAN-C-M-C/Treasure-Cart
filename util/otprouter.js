const express=require("express");
const router=express.Router();
const {sendOTP}=require("../controllers/otpController")
//request new otp
router.get("/",async(req,res)=>{
    try{
        const email=req.session.data.Email;
        const createdOTP=await sendOTP({email})
        res.status(200).render("./User/otp")
    }catch(err){
        res.status(400).json(err)
    }
})
module.exports=router