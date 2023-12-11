const Banner = require("../../Models/banner");
const { cropImage } = require("../../util/cropImages");
const getBanner = async (req, res) => {
    try {
        const pageNum = req.query.page ? req.query.page : 1;
        const perPage = 10;
        let x = Number((pageNum - 1) * perPage);

        const banner = await Banner.aggregate([
            { $sort: { _id: -1 } },
            // Add more stages if needed
        ]);
        var count = Math.floor(banner.length / 10) + 1;
        if (banner) {
            // console.log(banner);
            res.render("./Admin/Banner", { banner, x, count })
        } else {
            banner = []
            res.render("./Admin/Banner", { banner, x, count })
        }

    } catch (err) {
        console.log(err);
    }
}
const banner_add = async (req, res) => {
    try {
        const main = req.files["main"][0];

        // console.log("Uploaded files:");
        // console.log(main);
        const {
            title
        } = req.body;
        const check = await Banner.findOne({ title: title })
        // console.log("name is " + title);
        if (!check) {
            const data = {
                title: title,
                image: main.filename,
                status:"Active",
                timeStamp: Date.now(),
            };
            const insert = await Banner.insertMany([data]);
        }
        res.redirect("/admin/banner");
    } catch (err) {
        console.log("error found" + err);
    }
}
const deleteBanner=async(req,res)=>{
    try {
        const id=req.body.id;
        await Banner.deleteOne({_id:id}).then((data,err)=>{
            if(err){
                console.log(err);
            }else{
                res.json({success:true})
            }
        })
    } catch (err) {
        console.log(err);
    }
}
const banneractive=async (req,res)=>{
    try {
        // console.log("hello update");
        const id=req.body.id;
        const check=await Banner.findOne({_id:id})
        if(check.status==="Active"){
            await Banner.updateOne({_id:id},{$set:{status:"Inactive"}}).then((data,err)=>{
                if(err){
                    console.log(err);
                }else{
                    res.json({success:true})
                }
            })
        }else{
            await Banner.updateOne({_id:id},{$set:{status:"Active"}}).then((data,err)=>{
                if(err){
                    console.log(err);
                }else{
                    res.json({success:true})
                }
            })
        }
        
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    getBanner,
    banner_add,
    deleteBanner,
    banneractive
}