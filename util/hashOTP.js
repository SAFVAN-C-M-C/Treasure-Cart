const bcrypt=require("bcrypt");

const hashOTP=async(data,saltRound=10)=>{
    try{
        const hashedData=await bcrypt.hash(data,saltRound);
        return hashedData
    }catch(err){
        throw err;
    }
}
const verifyHashData=async (unhashed,hashed)=>{
    try{
        const match=await bcrypt.compare(unhashed,hashed);
        return match;
    }catch(err){
        throw err;
    }
}
module.exports={hashOTP,verifyHashData};