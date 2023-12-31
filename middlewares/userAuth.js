const Users = require("../Models/user");

function verifyUser(req, res, next) {
    if (req.session.logged) {
      next();
    } else {
      res.redirect("/logout");
    }
  }
function existingUser(req,res,next){
  if (req.session.logged) {
    res.redirect('/');
  } else {
    next();
  }
}
function otpverify(req,res,next){
  if (req.session.signotp || req.session.forgot) {
    next();
  }else{
    res.redirect("/logout")
  }
}
async function isBlocked(req,res,next){
  try{
    if(req.session.logged){
      const user=await Users.findOne({email:req.session.email})
      if(user.status==="Active"){
        next();
      }
      else{
        req.session.logged=false
        res.redirect("/login")
        req.flash("errmsg", "*User blocked by admin")
      }
    }else{
      next();
    }
  }catch(err){
    console.log(err);
    res.redirect("/login")
  }
}
function passrest(req,res,next){
  if (req.session.pass_reset) {
    next()
  }else{
    res.redirect("/logout")
  }
}
function verifyCheckout(req,res,next){
  if(req.session.checkout){
    next()
  }else{
    res.redirect("/cart")
  }
}
module.exports = { verifyUser,existingUser,otpverify,passrest,isBlocked,verifyCheckout };
  