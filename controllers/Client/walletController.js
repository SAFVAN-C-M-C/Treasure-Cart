const Users = require("../../Models/user");


const getWallet = async (req, res) => {
    try {
      const Email = req.session.email;
      const user=req.session.name
      const USER = await Users.findOne({ email: Email }).populate('referredUsers');
      console.log(USER);
      const userReferred = user.referredBy;
  
      if (!userReferred) {
        return res.render("./User/wallet", { user, USER,referred:'' ,cartCount:req.session.cartCount});
      }
  
      const referred = await Users.findById(userReferred);
  
      if (!referred) {
        console.error("Referred user not found");
        return res.render("./User/wallet", {user, USER,referred:'',cartCount:req.session.cartCount });
      }
  
      res.render("./User/wallet", { user, USER, referred,cartCount:req.session.cartCount });
    } catch (error) {
      console.error("Error while rendering the wallet page:", error);
    }
  };
const useWallet=async(req,res)=>{
  try {

    if(!req.session.walletClick){
    const total = req.body.total;
    req.session.total=total
    const userId = req.session.userid;
    const User=await Users.findOne({_id:userId});
    let walletbalance=User.wallet
    if(walletbalance>0){
      if(walletbalance>=total){
        req.session.totalAmount=0
        walletbalance=walletbalance-total
        req.session.walletbalance=walletbalance
      }else{
        req.session.totalAmount=total-walletbalance
        walletbalance=0;
        req.session.walletbalance=walletbalance
      }
      req.session.walletClick=true
    return res.status(200).json({ success: true, totalAmount: req.session.totalAmount });
  
    }else{
      return res.status(200).json({ success: false,error:"wallet have no ballence"});
    }}else{
      return res.status(200).json({ success: false,error:"wallet have no ballence"});
    }  
  
  } catch (error) {
    console.error(error);
    res.json({ error: "Some error occurred" });
  }
}
  module.exports={
    getWallet,
    useWallet
  }