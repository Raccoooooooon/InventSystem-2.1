const historyTable = document.getElementById('historyTable');
const inventoryTable = document.getElementById('inventoryTable');

// Fetch transaction history from Firestore
function fetchTransactionHistory() {
  const inventoryTransactions = db.collection('inventory');
  const salesTransactions = db.collection('sales');

  // Fetch sales transactions
  salesTransactions.onSnapshot(snapshot => {
    const salesData = [];
    snapshot.forEach(doc => {
      salesData.push({ ...doc.data(), id: doc.id, type: 'Sales' });
    });
    updateSalesTable(salesData);
  });

  // Fetch inventory transactions
  inventoryTransactions.onSnapshot(snapshot => {
    const inventoryData = [];
    snapshot.forEach(doc => {
      inventoryData.push({ ...doc.data(), id: doc.id, type: 'Inventory' });
    });
    updateInventoryTable(inventoryData);
  });
}

// Update inventory table
function updateInventoryTable(transactions) {
  inventoryTable.innerHTML = '';
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.type}</td>
      <td>${transaction.name}</td>
      <td>${transaction.quantity}</td>
      <td>${new Date(transaction.timestamp).toLocaleString()}</td>
    `;
    inventoryTable.appendChild(row);
  });
}

// Update sales table
function updateSalesTable(transactions) {
  historyTable.innerHTML = '';
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.type}</td>
      <td>${transaction.name}</td>
      <td>${transaction.quantity}</td>
      <td>${new Date(transaction.timestamp).toLocaleString()}</td>
    `;
    historyTable.appendChild(row);
  });
}


// Initial fetch
fetchTransactionHistory();

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