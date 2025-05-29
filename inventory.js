const form = document.getElementById('inventoryForm');
const inventoryTable = document.getElementById('inventoryTable');
const clearBtn = document.getElementById('clearForm');
const lookupBtn = document.getElementById('lookupBtn');
const lookupInput = document.getElementById('lookupName');

let inventoryData = [];

// Fetch inventory data from Firestore
function fetchInventory() {
  db.collection('inventory')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      let inventoryData = [];
      snapshot.forEach(doc => {
        inventoryData.push({ ...doc.data(), id: doc.id });
      });
      renderInventoryTable(inventoryData);
    });
}

// Render inventory table rows
function renderInventoryTable(data) {
  inventoryTable.innerHTML = '';
  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Rice Type">${item.name}</td>
      <td data-label="Quantity (sacks)">${item.quantity}</td> 
      <td data-label="Total Value">₱${item.price.toFixed(2)}</td>
      <td data-label="Actions">
        <button class="editBtn" data-id="${item.id}">Edit</button>
        <button class="deleteBtn" data-id="${item.id}">Delete</button>
      </td>
    `;
    inventoryTable.appendChild(row);
  });
}

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('itemName').value;
  const quantity = parseFloat(document.getElementById('itemQuantity').value);
  const price = parseFloat(document.getElementById('itemPrice').value);
  const timestamp = new Date().toISOString();

  // Check if the item already exists
  const existingItem = inventoryData.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (existingItem) {
    // Update the existing item's quantity and total value
    db.collection('inventory').doc(existingItem.id).update({
      quantity: existingItem.quantity + quantity,
      price: existingItem.price + price,
      timestamp
    });
  } else {
    // Add new item to inventory
    db.collection('inventory').add({
      name,
      quantity,
      price,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  form.reset();
});

// Handle Clear button
clearBtn.addEventListener('click', () => {
  form.reset();
});

// Handle table actions
inventoryTable.addEventListener('click', function (e) {
  const target = e.target;
  const id = target.getAttribute('data-id');
  const index = inventoryData.findIndex(item => item.id === id);

  if (target.classList.contains('editBtn')) {
    const item = inventoryData[index];
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemPrice').value = item.price;
    db.collection('inventory').doc(id).delete();
  } else if (target.classList.contains('deleteBtn')) {
    db.collection('inventory').doc(id).delete();
  }
});

// Handle Lookup functionality
lookupBtn.addEventListener('click', () => {
  const keyword = lookupInput.value.toLowerCase();
  const rows = inventoryTable.querySelectorAll('tr');
  rows.forEach(row => {
    const name = row.children[0].innerText.toLowerCase();
    row.style.display = name.includes(keyword) ? '' : 'none';
  });
});

// Initial fetch
fetchInventory();

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