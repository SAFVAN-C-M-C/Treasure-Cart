const OTP=require("../Models/otp");
const generateOTP = require("../util/generateOtp");
const sendEmail=require("../util/mail");
const bcrypt=require("bcrypt");
const {AUTH_EMAIL}=process.env;
const hashData=require("../util/hashOTP")
const sendOTP=async (email)=>{
    try{
        if(!(email)){
            throw Error("provide values for email,subject,message")
        }
        
        //clear old otp
        await OTP.deleteOne({email})

        //generate new otp
        const generatedOTP=await generateOTP();

        //sending email to the user
        const mailOptions={
            from:AUTH_EMAIL,
            to:email,
            subject:"Verify the email using this otp",
            html:`<p>Hello new user use the this otp to verify your email to continue </p><p style="color:tomato;font-size:25px;letter-spacing:2px;">
            <b>${generatedOTP}</b></p><p>OTP will expire in<b> 10 minute(s)</b>.</p>`
        }
        await sendEmail(mailOptions);

        //save otp record
        
        const hashedData=await bcrypt.hash(generatedOTP,10);
        function addMinutesToDate(date, minutes) {
            return new Date(date.getTime() + minutes * 60000); // 60000 milliseconds in a minute
          }
        const currentDate =new Date();
        const newDate = addMinutesToDate(currentDate, 10);
        const newOTP= await new OTP({
            email,
            otp:hashedData,
            createdAt:Date.now(),
            expireAt:newDate,
        })
        const createdOTPrecord=await newOTP.save()
        return createdOTPrecord
    }catch(err){
        throw err;
    }
}
module.exports=sendOTP;