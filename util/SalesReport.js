const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
const exceljs = require('exceljs');
const dateFormat = require('date-fns/format');


module.exports = {
  downloadReport: async (req, res, orders, startDate, endDate, totalSales, format) => {
    const formattedStartDate = dateFormat(new Date(startDate), 'yyyy-MM-dd');
    const formattedEndDate = dateFormat(new Date(endDate), 'yyyy-MM-dd');
    try {
      const totalAmount = parseInt(totalSales)
      console.log('Total Sales:', totalAmount);
      const template = fs.readFileSync(__dirname + '/Sales.ejs', 'utf-8');

      const html = ejs.render(template, { orders, startDate, endDate, totalAmount });
      console.log(typeof (totalAmount));
      if (format === 'pdf') {
        const pdfOptions = {
          format: 'Letter',
          orientation: 'portrait',
        };

        const filePath = `public/SALE-PDF/sales-report-${formattedStartDate}-${formattedEndDate}.pdf`;
        pdf.create(html, pdfOptions).toFile(filePath, (err, response) => {
          if (err) {
            console.error('Error generating PDF:', err);
            res.status(500).send('Internal Server Error');
          } else {
            res.status(200).download(response.filename);
          }
        });
      } else if (format === 'excel') {
        const workbook = new exceljs.Workbook();
          const worksheet = workbook.addWorksheet('Sales Report');
  
          worksheet.columns = [
            { header: 'Order ID', key: 'orderId', width: 40 },
            { header: 'Product Name', key: 'productName', width: 25 },
            { header: 'User ID', key: 'userId', width: 40,},
            { header: 'Date', key: 'date', width: 25 },
            { header: 'Total Amount', key: 'totalamount', width: 25 },
            { header: 'Payment Method', key: 'paymentmethod', width: 25 },
          ];
  
          let totalSalesAmount = 0;
  
          orders.forEach(order => {
          // console.log(orders);
            order.items.forEach(item => {
              // console.log(item);
              worksheet.addRow({
                orderId: order._id,
                productName: item.productId.name,
                userId: order.userId,
                date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '',
                totalamount: order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : '',
                paymentmethod: order.payMethod,
              });

             
              totalSalesAmount += order.totalPrice !== undefined ? order.totalPrice : 0;
              // console.log("@@@",totalSalesAmount);
            });
          });
  
          
          worksheet.addRow({ totalamount: 'Total Sales Amount', paymentmethod: totalSalesAmount.toFixed(2) });
  
          const excelFilePath = `public/SALE-EXCEL/sales-report-${formattedStartDate}-${formattedEndDate}.xlsx`;
          await workbook.xlsx.writeFile(excelFilePath);
        
        




        res.status(200).download(excelFilePath);
      } else {
        res.status(400).send('Invalid download format');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};
