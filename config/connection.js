const mongoose=require("mongoose");
require("dotenv").config()


module.exports=
mongoose.connect(process.env.URI)
.then(()=>{
    console.log("DB connected......");
})
.catch(err=>{
    console.log("Not connected....",process.env.URI,err);
})