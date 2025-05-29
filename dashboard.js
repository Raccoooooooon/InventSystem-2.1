// Real-time listeners for inventory and sales
let inventoryData = [];
let salesData = [];

function fetchDashboardData() {
  // Listen for inventory changes
  db.collection('inventory').onSnapshot(snapshot => {
    inventoryData = [];
    snapshot.forEach(doc => {
      inventoryData.push({ ...doc.data(), id: doc.id });
    });
    updateDashboard();
  });

  // Listen for sales changes
  db.collection('sales').onSnapshot(snapshot => {
    salesData = [];
    snapshot.forEach(doc => {
      salesData.push({ ...doc.data(), id: doc.id });
    });
    updateDashboard();
  });
}

function updateDashboard() {
  // Calculate total value in inventory
  const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.price || 0), 0);

  // Calculate total sale value in sales
  const totalSalesValue = salesData.reduce((sum, sale) => sum + ((sale.quantity || 0) * (sale.price || 0)), 0);

  // Calculate earn
  const earn = totalSalesValue - totalInventoryValue;

  // Update Earn Table
  document.getElementById('earnTable').innerHTML = `
    <tr>
      <td style="color: ${earn >= 0 ? 'green' : 'red'}; font-weight: bold;">
        ₱${earn.toFixed(2)}
      </td>
    </tr>
  `;

  // Update Inventory and Sales Tables
  document.getElementById('inventoryTable').innerHTML = `
    <tr>
      <td>₱${totalInventoryValue.toFixed(2)}</td>
    </tr>
  `;

  document.getElementById('salesTable').innerHTML = `
    <tr>
      <td>₱${totalSalesValue.toFixed(2)}</td>
    </tr>
  `;

  // Calculate total number of sacks and total weight in kilograms from inventory
  const totalSacks = inventoryData.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalInventoryWeightKg = totalSacks * 50; // Each sack is equivalent to 50kg

  // Calculate total quantity sold (kg) from sales
  const totalQuantitySoldKg = salesData.reduce((sum, sale) => sum + (sale.quantity || 0), 0);

  // Calculate available stocks (kg)
  const availableStocksKg = totalInventoryWeightKg - totalQuantitySoldKg;

  // Update the summary section
  document.getElementById('inventoryWeight').textContent = `${totalInventoryWeightKg} kg`;
  document.getElementById('quantitySold').textContent = `${totalQuantitySoldKg} kg`;
  document.getElementById('availableStocks').textContent = `${availableStocksKg} kg`;
}

// Start real-time dashboard updates
fetchDashboardData();

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
