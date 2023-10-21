function err(req,res,next){
    if (req.session.err) {
        next()
    }else{
        res.redirect("/user/logout");
    }
}
module.exports={err}