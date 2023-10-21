function verifyadmin(req, res, next) {
    if (req.session.admin) {
      next();
    } else {
      res.redirect("/admin/logout");
    }
  }
  function existingadmin(req,res,next){
  if (req.session.admin) {
    res.redirect("/admin/Dashbord");
  }else{
    next()
  }
  }
  
  module.exports = { verifyadmin,existingadmin };
  