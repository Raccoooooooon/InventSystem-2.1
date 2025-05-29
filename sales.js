const salesForm = document.getElementById('salesForm');
const salesTable = document.getElementById('salesTable');

let salesData = []; // <-- Add this at the top

// Add sale to Firestore on form submit
salesForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('saleItemName').value;
  const quantity = parseFloat(document.getElementById('saleQuantity').value);
  const price = parseFloat(document.getElementById('salePrice').value);

  db.collection('sales').add({
    name,
    quantity,
    price,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    salesForm.reset();
  }).catch(error => {
    alert('Error saving sale: ' + error.message);
  });
});

// Real-time listener for sales collection, ordered by timestamp descending
db.collection('sales')
  .orderBy('timestamp', 'desc')
  .onSnapshot(snapshot => {
    salesData = []; // <-- Update the global variable
    snapshot.forEach(doc => {
      salesData.push({ ...doc.data(), id: doc.id });
    });
    renderSalesTable(salesData);
  });

function renderSalesTable(salesData) {
  salesTable.innerHTML = '';
  salesData.forEach(sale => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.name}</td>
      <td>${sale.quantity}</td>
      <td>₱${sale.price.toFixed(2)}</td>
      <td>₱${(sale.quantity * sale.price).toFixed(2)}</td>
      <td>
        <button class="deleteSaleBtn" data-id="${sale.id}">Delete</button>
      </td>
    `;
    salesTable.appendChild(row);
  });
}

// Handle delete button clicks
salesTable.addEventListener('click', function (e) {
  if (e.target.classList.contains('deleteSaleBtn')) {
    const id = e.target.getAttribute('data-id');
    db.collection('sales').doc(id).delete();
  }
});

// Clear button functionality
if (document.getElementById('clearBtn')) {
  document.getElementById('clearBtn').addEventListener('click', function () {
    salesForm.reset();
  });
}

// Lookup button functionality
if (document.getElementById('lookupBtn')) {
  document.getElementById('lookupBtn').addEventListener('click', function () {
    const name = document.getElementById('saleItemName').value;
    const price = parseFloat(document.getElementById('salePrice').value);

    // Find the sale by name and price
    const sale = salesData.find(
      sale => sale.name.toLowerCase() === name.toLowerCase() && sale.price === price
    );

    if (sale) {
      // Populate the form with the sale data
      document.getElementById('saleQuantity').value = sale.quantity;
    } else {
      alert('Sale not found');
    }
  });
}

// Logout button functionality
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.removeItem('loggedIn');
    window.location.href = "login.html";
  });
}

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

