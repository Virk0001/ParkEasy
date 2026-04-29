document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // 🔐 In production, use API call to validate with backend
  if (email && password) {
    // Basic mock authentication (replace with real backend logic)
    if (role === "user") {
      window.location.href = "user-dashboard.html";
    } else if (role === "employee") {
      window.location.href = "employee-dashboard.html";
    } else {
      alert("Please select a role.");
    }
  } else {
    alert("Please fill in all fields.");
  }
});
