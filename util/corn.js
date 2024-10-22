const cron = require("node-cron");
const offer = require("../Models/offers");
const Categories = require("../Models/category");
const Products = require("../Models/product");



const CheckTheExpireDateOfOffer = async () => {
    // console.log("runningcron.............!!!");
    try {
        const currentDate = Date.now();
        const offers = await offer.find({ expireDate: { $lte: currentDate } });

        if (offers.length > 0) {
            for (const Offer of offers) {
                const { categoryName } = Offer;
                const fetchCategoryId = await Categories.findOne({ name: categoryName });
                const categoryId = fetchCategoryId._id;
                const productsBeforeOffer = await Products.find({ categoryId });
                for (const product of productsBeforeOffer) {
                    product.descountedPrice = product.basePrice || 0;
                    product.basePrice=product.beforeOffer ||0;
                    product.IsInCategoryOffer = false;
                    product.categoryOffer.offerPercentage = undefined
                    product.save()
                }
                await offer.findByIdAndDelete(Offer._id);
            }
            console.log("deleted");
        }

    } catch (error) {
        console.error("Error in the cron job:", error);
        throw error;
    }
};

cron.schedule("5 0 * * *", async () => {
    try {
        await CheckTheExpireDateOfOffer();
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});
