const express=require("express");
const app =express();

app.listen(PORT,()=>{
    console.log(`The app is working on the port ${PORT}`);
})