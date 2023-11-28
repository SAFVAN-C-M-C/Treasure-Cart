const easyinvoice = require('easyinvoice');
const fs = require('fs');
const path = require('path');

module.exports = {
    generateInvoice: async (orderDetails) => {
        try {
            var data = {
                
                "customize": {
                },
                "images": {
                    "logo": fs.readFileSync(path.join(__dirname, '..', 'public', 'images', 'logo.png'), 'base64'),
                },
                "sender": {
                    "company": "Treasure Cart",
                    "address": "Tirur",
                    "zip": "676109",
                    "city": "Malappuram",
                    "state": "Kerala"
                },
                "client": {
                    "company": orderDetails.address.name,
                    "address": orderDetails.address.address,
                    "zip":orderDetails.address.pincode ,
                    "city": orderDetails.address.city,
                    "state":orderDetails.address.state,
                    "Mob No": orderDetails.address.mobile
                },
                "information": {
                    "Order ID": orderDetails._id,
                    "date": orderDetails.orderDate.toDateString(),
                    "invoice date": orderDetails.orderDate.toDateString(),
                },
                "products": (orderDetails.items && orderDetails.items.length > 0) ? orderDetails.items.map((product) => ({
                    "quantity": product.quantity,
                    "description": product.productId.name, 
                    "tax-rate": 12,
                    "price": product.productId.descountedPrice
                })) : [],
                
    
                "bottom-notice": "Thank You For Your Purchase",
                "settings": {
                    "currency": "USD",
                    "tax-notation": "vat",
                    "currency": "INR",
                    "tax-notation": "GST",
                    "margin-top": 50,
                    "margin-right": 50,
                    "margin-left": 50,
                    "margin-bottom": 25
                },
    
          
        }

            const result = await easyinvoice.createInvoice(data);

            const filePath = path.join(__dirname, '..', 'public','pdf', `${orderDetails._id}.pdf`);
            await fs.promises.writeFile(filePath, result.pdf, 'base64');

            return filePath;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
