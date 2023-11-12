async function updateSalesGraph(timeInterval) {
    const salesData = await fetchSalesData(timeInterval);
    console.log("salesData",salesData);
    const Amount = document.getElementById("salesGraphAmount").getContext("2d");
    const Count = document.getElementById("salesGraphCount").getContext("2d");
  
    if (window.myChart1) {
      window.myChart1.destroy();
    }
    if (window.myChart2) {
      window.myChart2.destroy();
    }
  
    window.myChart1 = new Chart(Amount, {
      type: "line",
      data: {
        labels: salesData.labelsByAmount,
        datasets: [{
          label: "Sales by amount",
          data: salesData.dataByAmount,
          borderColor: "#4285F4",
          fill: true
        }]
      },
      options: {
        legend: { display: true },
      }
    });
  
    const barColors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"];
    window.myChart2 = new Chart(Count, {
      type: "bar",
      data: {
        labels: salesData.labelsByCount,
        datasets: [
          {
            label: "Sales by order",
            data: salesData.dataByCount,
            backgroundColor: barColors,
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          x: [{
            grid: {
              display: true
            }
          }],
          y: [{
            beginAtZero: true,
            maxTicksLimit: 5
          }]
        }
      },
    });
  
}
async function fetchSalesData(timeInterval) {
    try {
      let response;
      if (timeInterval === "day") {
        response = await fetch('/admin/count-orders-by-day');
        console.log("resssssss",response.dataByAmount);
      } else if (timeInterval === "month") {
        console.log("monthsss");
        response = await fetch(`/admin/count-orders-by-${timeInterval}`);
      } else if (timeInterval === "year") {
        console.log("yearssss");
        response = await fetch(`/admin/count-orders-by-${timeInterval}`);
      } else {
        return false;
      }
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  console.log("here at fetchSalesData",data);
  
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
updateSalesGraph("day");
document.getElementById("byDayOption").addEventListener("click", function () {
  document.getElementById("timeIntervalDropdown").textContent = "By Day";
  updateSalesGraph("day");
});




document.getElementById("byMonthOption").addEventListener("click", function () {
  document.getElementById("timeIntervalDropdown").textContent = "By Month";
  updateSalesGraph("month");
});

document.getElementById("byYearOption").addEventListener("click", function () {
  document.getElementById("timeIntervalDropdown").textContent = "By Year";
  updateSalesGraph("year");
});






async function fetchOrdersAndSales() {
  try {

    const response = await fetch("/admin/latestOrders");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error fetching data", error);
  }
}








async function updateLatestOrdersAndBestSellers() {
  const data = await fetchOrdersAndSales();
  const latestOrdersTable = document.getElementById("latestOrdersTable");
  const bestSellersTable = document.getElementById("bestSellersTable");
  const ordersData = data.latestOrders;
  const bestSellersData = data.bestSeller;

  ordersData.forEach((order) => {
    const row = latestOrdersTable.insertRow();
    const orderIdCell = row.insertCell(0);
    const dateCell = row.insertCell(1);
    const totalCell = row.insertCell(2);
    const paymentCell = row.insertCell(3);
    const statusCell = row.insertCell(4);

    orderIdCell.textContent = order._id;
    dateCell.textContent = order.OrderDate;
    totalCell.textContent = order.TotalPrice;
    paymentCell.textContent = order.PaymentMethod;
    statusCell.textContent = order.PaymentStatus;
  });

  bestSellersData.forEach((seller) => {
    const row = bestSellersTable.insertRow();
    const productImageCell = row.insertCell(0);
    const productCell = row.insertCell(1);
    const productNameCell = row.insertCell(2);
    const priceCell = row.insertCell(3);
    const statusCell = row.insertCell(4);
    const salesCell = row.insertCell(5);

    const imgElement = document.createElement("img");
    const imageUrl = "/product-images/" + seller.productDetails?.images[0]?.mainimage;
    imgElement.src = imageUrl;
    imgElement.style.maxWidth = "50px";
    productImageCell.appendChild(imgElement);

    productCell.textContent = seller.productDetails._id;
    productNameCell.textContent = seller.productDetails.name;
    priceCell.textContent = seller.productDetails.descountedPrice;
    statusCell.textContent = seller.productDetails.stock === 0 ? "Out of Stock" : "In Stock";
    salesCell.textContent = seller.totalCount;
  });
}



updateSalesGraph();
updateLatestOrdersAndBestSellers();

document.getElementById('generateReportBtn').addEventListener('click', function () {

  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;


  const generatePDF = document.getElementById('pdfCheckbox').checked;
  const generateExcel = document.getElementById('excelCheckbox').checked;


  generateReport(startDate, endDate, generatePDF, generateExcel);

  $('#staticBackdrop').modal('hide');
});


function generatePDFReport() {

  fetch('/admin/generatepdf')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      console.log('Fetched orders:', data);

    })
    .catch(error => {
      console.error('Error fetching orders:', error);
    });

}


function generateExcelReport() {

}


function generateReport(startDate, endDate, generatePDF, generateExcel) {
  if (generatePDF) {
    generatePDFReport();
  }
  if (generateExcel) {
    generateExcelReport();
  }
}


