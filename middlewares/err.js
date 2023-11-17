function err(req,res,next){
    if (req.session.err) {
        next()
    }else{
        res.redirect("/admin/logout");
    }
}
module.exports={err}