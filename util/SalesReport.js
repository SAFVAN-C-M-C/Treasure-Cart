const ejs = require('ejs');
const fs = require('fs');
const exceljs = require('exceljs');
const dateFormat = require('date-fns/format');
// const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const { s3Client } = require('./upload');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
require("dotenv").config()
// const salesPdf = require('./pdfgenerator')
// const { PassThrough } = require('stream');


// Table Row with Bottom Line
function generateTableRow(doc, y, c1, c2, c3, c4, c5, c6, c7) {
  doc
    .fontSize(7)
    .text(c1, 40, y)
    .text(c2, 70, y)
    .text(c3, 180, y)
    .text(c4, 300, y)
    .text(c5, 400, y)
    .text(c6, 470, y)
    .text(c7, 0, y, { align: "right" })
    .moveTo(50, y + 15)
    .lineTo(560, y + 15)
    .lineWidth(0.5)
    .strokeColor("#ccc")
    .stroke();
}

// Table row without bottom line
function generateTableRowNoLine(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(7)
    .text(c1, 100, y)
    .text(c2, 100, y)
    .text(c3, 420, y, { width: 90, align: "right" })
    .text(c4, 200, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}

// Generating Invoice for customers
const generateSalesPDF = async (order, startDate, endDate) => {

  return new Promise((resolve, reject) => {
    try {


      const doc = new PDFDocument({ margin: 50 });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));

      // Products
      // Footer for the PDF
      doc
        .fontSize(15)
        .text(
          `Treassure Cart`,
          50,
          50,
          {
            align: "center",
            width: 500,
            color: "white",
            backgroundColor: "gray",
          }
        );

      const invoiceTableTop = 100;

      // Table Header 
      generateTableRow(
        doc,
        invoiceTableTop,
        "SL No",
        "Order ID",
        "User ID",
        "Order Date",
        "Payment Method",

        "Amount"
      );

      let i = 0;
      let sum = 0;
      order.forEach((x) => {
        var position = invoiceTableTop + (i + 1) * 30;
        sum += x.totalPrice;

        generateTableRow(
          doc,
          position,
          i + 1,
          x._id,
          x.userId,
          x.orderDate.toDateString(),
          x.payMethod,
          x.totalPrice.toLocaleString()
        );
        i++;
      });

      // Summary rows
      const subtotalPosition = invoiceTableTop + order.length * 30;

      const paidToDatePosition = subtotalPosition + 30;

      const duePosition = paidToDatePosition + 30;
      generateTableRowNoLine(doc, duePosition, "", "", "Total", "   ", sum.toLocaleString());

      // End the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};



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
        const pdfGenarate = await generateSalesPDF(orders, startDate, endDate)
        console.log("pdf generated successfully");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=sales Report.pdf"
        );
        console.log('pdf....');
        res.status(200).end(pdfGenarate);
      } else if (format === 'excel') {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        worksheet.columns = [
          { header: 'Order ID', key: 'orderId', width: 40 },
          { header: 'Product Name', key: 'productName', width: 25 },
          { header: 'User ID', key: 'userId', width: 40, },
          { header: 'Date', key: 'date', width: 25 },
          { header: 'Total Amount', key: 'totalamount', width: 25 },
          { header: 'Payment Method', key: 'paymentmethod', width: 25 },
        ];

        let totalSalesAmount = 0;

        orders.forEach(order => {
          order.items.forEach(item => {
            worksheet.addRow({
              orderId: order._id,
              productName: item.productId.name,
              userId: order.userId,
              date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '',
              totalamount: order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : '',
              paymentmethod: order.payMethod,
            });
            totalSalesAmount += order.totalPrice !== undefined ? order.totalPrice : 0;
          });
        });


        worksheet.addRow({ totalamount: 'Total Sales Amount', paymentmethod: totalSalesAmount.toFixed(2) });
        // Create a buffer from the workbook
        const excelBuffer = await workbook.xlsx.writeBuffer();

        // Define the S3 bucket and file details
        const bucketName = process.env.S3_BUCKET; // Your bucket name
        const fileName = `/treasure-cart/sales-report/sales-report-${Date.now()}.xlsx`; // Unique file name for S3

        // Upload the buffer to S3
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: excelBuffer,
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        await s3Client.send(command);
        // Provide the public URL to download the file
        const fileUrl = `https://s3.ap-south-1.amazonaws.com/${bucketName}/${fileName}`;
        res.redirect(fileUrl); // Redirects to the URL for download


        // res.status(200).download(excelFilePath);
      } else {
        res.status(400).send('Invalid download format');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};
