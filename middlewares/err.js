function err(req,res,next){
    if (req.session.err) {
        next()
    }else{
        res.redirect("/logout");
    }
}
module.exports={err}