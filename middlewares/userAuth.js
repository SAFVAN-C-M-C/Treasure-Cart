const Users = require("../Models/user");

function verifyUser(req, res, next) {
    if (req.session.logged) {
      next();
    } else {
      res.redirect("/user/logout");
    }
  }
function existingUser(req,res,next){
  if (req.session.logged) {
    res.redirect('/user/home');
  } else {
    next();
  }
}
function otpverify(req,res,next){
  if (req.session.signotp || req.session.forgot) {
    next();
  }else{
    res.redirect("/user/logout")
  }
}
async function isBlocked(req,res,next){
  try{
  const user=await Users.findOne({_id:req.session.userid})
  if(user.status==="Active"){
    next();
  }
  else{
    req.session.logged=false
    res.redirect("/")
    req.flash("errmsg", "*User blocked by admin")
  }
  }catch(err){
    console.log(err);
    res.redirect("/user/logout")
  }
}
function passrest(req,res,next){
  if (req.session.pass_reset) {
    next()
  }else{
    res.redirect("/user/logout")
  }

}
module.exports = { verifyUser,existingUser,otpverify,passrest,isBlocked };
  