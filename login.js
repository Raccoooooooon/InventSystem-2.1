document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const key = document.getElementById('productKey').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  if (key.toUpperCase() === "OCA") { // Make comparison case-insensitive
    sessionStorage.setItem('loggedIn', 'true');
    window.location.href = "dashboard.html";
  } else {
    errorMsg.textContent = "Invalid Product ID Key.";
  }
});

// Optional: Redirect to dashboard if already logged in
if (sessionStorage.getItem('loggedIn') === 'true') {
  window.location.href = "dashboard.html";
}