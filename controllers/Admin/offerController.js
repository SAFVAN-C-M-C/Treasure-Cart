const Categories = require("../../Models/category");
const offer = require("../../Models/offers");
const Products = require("../../Models/product");
const { ObjectId,Types } = require("mongoose");

const getOffers=async(req,res)=>{
    try {
        const categories = await Categories.find()
        const offers=await offer.find();
        res.render("./Admin/categoryOffers",{offers,count:10,categories});
    } catch (err) {
        console.log(err);
        res.render("./Admin/categoryOffers",{offers:[],count:10,categories:[]});
        
    }
}

//add category offer
const addCategoryOffer = async (req, res) => {
    try {
        const { categoryName, percentage, expireDate } = req.body;
        const newOffer = new offer({
            categoryName,
            percentage,
            expireDate,
            status: 'Active', 
        });
        await newOffer.save();

        const fetchCategoryId = await Categories.findOne({ name: categoryName });

        if (!fetchCategoryId) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const categoryId = fetchCategoryId._id;
       

        const products = await Products.find({ categoryId });
        const offerMultiplier = 1 - percentage / 100;

        for (const product of products) {
            product.beforeOffer = product.basePrice;
            product.basePrice=product.descountedPrice
            product.IsInCategoryOffer=true;
            product.categoryOffer.offerPercentage=percentage;
            product.descountedPrice=Math.floor(product.descountedPrice*offerMultiplier)
            product.save()
        }
        res.status(201).json({ success: true, message: 'Category offer added successfully' });

    } catch (error) {
        console.error('Error while adding the category offer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



//delete offer
const deleteOffer=async(req,res)=>{
    try {
        const offerId = req.params.offerId;

        const Offer = await offer.findOne({_id:new Types.ObjectId(offerId)});
        if (!Offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        const { categoryName } = Offer;
        const fetchCategoryId = await Categories.findOne({ name: categoryName });
        if (!fetchCategoryId) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const categoryId = fetchCategoryId._id;
        const productsBeforeOffer = await Products.find({ categoryId });

         for (const product of productsBeforeOffer) {
            product.descountedPrice = product.basePrice || 1;
            product.basePrice=product.beforeOffer|| 0
            product.beforeOffer=0;
            product.IsInCategoryOffer=false;
            product.categoryOffer.offerPercentage=undefined
            product.save()
        }
        await offer.findByIdAndDelete(offerId);
        res.json({ success: true, message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//get category name
const getCategoryName = async (req, res) => {
    try {
        const categoryNames = req.params.categoryName;
        const categoryName = categoryNames.trim();

        const existingCategory = await Categories.findOne({ name: categoryName });
        if(existingCategory){
            res.json({ exists: true });
        }else{
            res.json({ exists: false });
        }

       
    } catch (error) {
        console.error('Error checking category existence:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const checkOfferExists = async (req, res) => {
    try {
      const categoryName = req.params.categoryName;
  
      const existingOffer = await offer.findOne({ categoryName: categoryName });
      if(existingOffer){
        res.json({ exists: true });
      }else{
        res.json({ exists: false });
      }

    } catch (error) {
      console.error('Error checking offer existence:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



 //edit category Offer
//  const EditOffer=async(req,res)=>{
//     try {
//         const categoryId= req.params.categoryId;
//         const offer= await Offer.findOne({_id: categoryId})
//         res.render('admin/editOffer',{offer})
//     } catch (error) {
//         console.error('error while editing category offer:',error)
//     }
//  }



 // Update offer
const updateOffer = async (req, res) => {
    try {
        const { percentage, expireDate } = req.body;
        let offerId = req.params.offerId;

        const existingOffer = await offer.findOne({_id:offerId});

        if (!existingOffer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

     
        existingOffer.percentage = percentage;
        existingOffer.expireDate = expireDate;
        await existingOffer.save();

     
        const fetchCategoryId = await Categories.findOne({ name: existingOffer.categoryName });
        if (!fetchCategoryId) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const categoryId = fetchCategoryId._id;

      
        const productsBeforeOffer = await Products.find({ categoryId });
        const offerMultiplier = 1 - percentage / 100;
        
        for (const product of productsBeforeOffer) {
            const discountPrice = product.basePrice || 0; 
            const newDiscountedPrice = Math.floor(offerMultiplier * discountPrice);
            product.descountedPrice=newDiscountedPrice;
            product.IsInCategoryOffer=true;
            product.categoryOffer.offerPercentage=percentage
            product.save()
        }

        res.status(201).json({ success: true, message: 'Category offer edited successfully' });

    } catch (error) {
        console.error('Error while updating the category offer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};











module.exports={
    getOffers,
    addCategoryOffer,
    deleteOffer,
    getCategoryName,
    checkOfferExists,
    updateOffer
}