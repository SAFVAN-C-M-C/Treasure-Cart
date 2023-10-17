function verifyadmin(req, res, next) {
    if (req.session.logged) {
      next();
    } else {
      res.redirect("/");
    }
  }
  
  module.exports = { verifyUser };
  