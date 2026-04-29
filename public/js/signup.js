document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    const messageDiv = document.getElementById("message");
  
    if (password !== confirmPassword) {
      messageDiv.style.color = "red";
      messageDiv.textContent = "❌ Passwords do not match!";
      return;
    }
  
    // Simulate storing data (e.g., send to backend)
    const userData = {
      role,
      username,
      email,
      password,
    };
  
    // Simulated storage (replace with backend call)
    localStorage.setItem(`user_${username}`, JSON.stringify(userData));
  
    messageDiv.style.color = "green";
    messageDiv.textContent = "✅ Registration successful! Redirecting to login...";
  
    setTimeout(() => {
      window.location.href = "../login/index.html";
    }, 2000);
  });
  