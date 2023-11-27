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
        
        // Define styles
        const mainHeaderStyle = {
          font: { size: 16, bold: true },
          alignment: { horizontal: 'center' },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '87CEEB' }, // Light blue background color
          },
        };
        
        const subHeaderStyle = {
          font: { bold: true },
          alignment: { horizontal: 'center' },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ADD8E6' }, // Light blue background color
          },
        };
        
        const cellStyle = {
          alignment: { horizontal: 'left' },
        };
        
        // Add main heading
        worksheet.addRow(['Treasure Cart']).eachCell((cell, colNumber) => {
          cell.style = mainHeaderStyle;
        });
        worksheet.mergeCells('A1:F1');
        
        // Add subheadings
        worksheet.addRow([
          'Order ID',
          'Product Name',
          'User ID',
          'Date',
          'Total Amount',
          'Payment Method',
        ]).eachCell((cell, colNumber) => {
          cell.style = subHeaderStyle;
          worksheet.getColumn(colNumber).width = 20; // Set column width
        });
        
        let totalSalesAmount = 0;
        
        orders.forEach((order, rowIndex) => {
          order.items.forEach(item => {
            const rowStyle = rowIndex % 2 === 0 ? {} : { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0F0F0' } } };
            
            worksheet.addRow({
              orderId: order._id,
              productName: item.productId.name,
              userId: order.userId,
              date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '',
              totalamount: order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : '',
              paymentmethod: order.payMethod,
            }).eachCell((cell, colNumber) => {
              cell.style = { ...cellStyle, ...rowStyle }; // Apply cell style with alternating row color
            });
          });
        });
        
        worksheet.addRow({ totalamount: 'Total Sales Amount', paymentmethod: totalSalesAmount.toFixed(2), style: subHeaderStyle });
        
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
