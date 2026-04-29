const fines = [
    {
      date: "2025-04-05",
      user: "Alice",
      vehicle: "ABC1234",
      reason: "Overstay",
      amount: 200
    },
    {
      date: "2025-04-04",
      user: "Bob",
      vehicle: "XYZ5678",
      reason: "Wrong Parking",
      amount: 150
    }
  ];
  
  function renderFines() {
    const tbody = document.getElementById("finesTableBody");
    tbody.innerHTML = "";
  
    fines.forEach(fine => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${fine.date}</td>
        <td>${fine.user}</td>
        <td>${fine.vehicle}</td>
        <td>${fine.reason}</td>
        <td>${fine.amount}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  document.getElementById("fineForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const user = document.getElementById("user").value;
    const vehicle = document.getElementById("vehicle").value;
    const reason = document.getElementById("reason").value;
    const amount = document.getElementById("amount").value;
  
    const today = new Date().toISOString().split("T")[0];
    fines.push({ date: today, user, vehicle, reason, amount });
  
    renderFines();
  
    this.reset();
  });
  
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
  
  renderFines();
  