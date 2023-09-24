const user=require("../Models/user")
const bcrypt=require("bcrypt")

const userSignup=async(req,res)=>{
    console.log(req.body);
    try{
    const check=await user.find({Email:req.body.email})
    console.log(typeof(check));
    if(check.length==0){
    const pass=await bcrypt.hash(req.body.password, 10);
    const data={
        UserName:req.body.name,
        Email:req.body.email,
        Password:pass,
    }
    const result=await user.insertMany([data])
    if(result){
        res.redirect('/')
    }
    else{
        res.redirect('/user/signup')
    }
}else{
    req.session.errmsgsign="user already exist"
    res.redirect('/user/signup')
     console.log("user already exist");
}
}catch(e){
    console.log(e);
}
    
}
const userLogin=async(req,res)=>{
    try{
        const check=await user.findOne({Email:req.body.email})
        console.log(check);
        console.log(req.body);
        let isMatch = await bcrypt.compare(
            req.body.password,
            check.Password
          );
        if(isMatch){
            req.session.name=check.name;
            req.session.logged=true;
            console.log("Login success");
            res.redirect("/user/home");
        }
        else{
            req.session.errmsg="invalid password"
            res.redirect('/')
            console.log("invalid password");
        }
    }catch{
    req.session.errmsg="user not found"
    res.redirect('/')
    console.log("user not found");
    }
}




module.exports={
 userLogin,
 userSignup   
}