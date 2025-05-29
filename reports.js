const reportsTable = document.getElementById('reportsTable');
const yearSelector = document.getElementById('yearSelector');
const ctx = document.getElementById('salesLineChart').getContext('2d');
let salesChart;

let inventoryData = [];
let salesData = []; // Dapat isa lang ito

db.collection('inventory').onSnapshot(snapshot => {
  inventoryData = [];
  snapshot.forEach(doc => inventoryData.push(doc.data()));
  updateChart(getSelectedYear());
});

// Example Firestore usage
db.collection('sales').onSnapshot(snapshot => {
  salesData = [];
  snapshot.forEach(doc => {
    salesData.push({ ...doc.data(), id: doc.id });
  });
  updateChart(getSelectedYear());
});

// Helper function to group data by month and year
function groupInvDataByMonthAndYear(data, year) {
  const grouped = {};
  data.forEach(item => {
    const date = new Date(item.timestamp);
    if (date.getFullYear() === year) {
      const month = date.toLocaleString('default', { month: 'long' }); // Full month name
      if (!grouped[month]) {
        grouped[month] = 0;
      }
      grouped[month] +=  item.price; // Calculate total value
    }
  });
  return grouped;
}
function groupSalesDataByMonthAndYear(data, year) {
  const grouped = {};
  data.forEach(item => {
    const date = new Date(item.timestamp);
    if (date.getFullYear() === year) {
      const month = date.toLocaleString('default', { month: 'long' }); // Full month name
      if (!grouped[month]) {
        grouped[month] = 0;
      }
      grouped[month] += item.quantity * item.price; // Calculate total value
    }
  });
  return grouped;
}

// Function to update the chart
function updateChart(year) {
  const groupedInventory = groupInvDataByMonthAndYear(inventoryData, year);
  const groupedSales = groupSalesDataByMonthAndYear(salesData, year);

  const months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const inventoryValues = months.map(month => groupedInventory[month] || 0);
  const salesValues = months.map(month => groupedSales[month] || 0);

  inventoryChart.data.labels = months;
  inventoryChart.data.datasets[0].data = inventoryValues;
  inventoryChart.data.datasets[1].data = salesValues;
  inventoryChart.update();
}

// Create the inventory line chart
const inventoryChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Inventory Total Value (₱)',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Total Sale Value (₱)',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Values (₱)' },
        ticks: {
          callback: function (value) { return `₱${value}`; },
        },
      },
      x: { title: { display: true, text: 'Months (January to December)' } },
    },
  },
});


// Event listener for year selection
yearSelector.addEventListener('change', () => {
  const selectedYear = parseInt(yearSelector.value, 10);
  updateChart(selectedYear);
});

// Initial render for the default year (2025)
updateChart(2025);

function getSelectedYear() {
  return parseInt(yearSelector.value, 10) || new Date().getFullYear();
}

document.getElementById('logoutBtn').addEventListener('click', function() {
  sessionStorage.removeItem('loggedIn');
  window.location.href = "login.html";
});

document.addEventListener('DOMContentLoaded', function() {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.querySelector('.sidebar');
  const menuOverlay = document.getElementById('menuOverlay');

  if (menuToggleBtn && sidebar && menuOverlay) {
    menuToggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('sidebar-open');
      menuOverlay.classList.toggle('active');
    });

    menuOverlay.addEventListener('click', function() {
      sidebar.classList.remove('sidebar-open');
      menuOverlay.classList.remove('active');
    });
  }
});