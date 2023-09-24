const mongoose=require("mongoose");
const dotenv=require("dotenv")
dotenv.config({path:'config.env'})


module.exports=
mongoose.connect(process.env.URI)
.then(()=>{
    console.log("DB connected......");
})
.catch(err=>{
    console.log("Not connected....",err);
})