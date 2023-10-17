function verifyUser(req, res, next) {
    if (req.session.logged) {
      next();
    } else {
      res.redirect("/user/logout");
    }
  }
  
  module.exports = { verifyUser };
  