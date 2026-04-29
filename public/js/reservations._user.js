document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/user-dashboard/index.html"; // Adjust if needed
  });
  
  document.getElementById("reservationForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const lot = document.getElementById("lot").value;
    const vehicle = document.getElementById("vehicle").value;
    const entry = document.getElementById("entry").value;
    const exit = document.getElementById("exit").value;
  
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>Lot:</strong> ${lot}<br/>
      <strong>Vehicle:</strong> ${vehicle}<br/>
      <strong>Entry:</strong> ${new Date(entry).toLocaleString()}<br/>
      <strong>Exit:</strong> ${new Date(exit).toLocaleString()}
    `;
  
    document.getElementById("reservationList").prepend(card);
  
    alert("Reservation added!");
    this.reset();
  });
  