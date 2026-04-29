const charges = [
    { id: 1, type: 'Parking Fee', amount: 50.00, paid: false },
    { id: 2, type: 'Fine - Overstay', amount: 100.00, paid: false },
    { id: 3, type: 'Fine - No Reservation', amount: 150.00, paid: true },
    { id: 4, type: 'Parking Fee', amount: 40.00, paid: true }
  ];
  
  const unpaidContainer = document.getElementById("chargesList");
  const paidContainer = document.getElementById("paymentHistory");
  
  function renderCharges() {
    unpaidContainer.innerHTML = '';
    paidContainer.innerHTML = '';
  
    charges.forEach(charge => {
      const card = document.createElement("div");
      card.className = "card" + (charge.paid ? " paid" : "");
      card.innerHTML = `
        <strong>${charge.type}</strong><br/>
        Amount: ₹${charge.amount.toFixed(2)}
      `;
  
      if (!charge.paid) {
        const payBtn = document.createElement("button");
        payBtn.className = "pay";
        payBtn.innerText = "Pay";
        payBtn.addEventListener("click", () => {
          charge.paid = true;
          renderCharges();
          alert("Payment successful for: " + charge.type);
        });
        card.appendChild(payBtn);
        unpaidContainer.appendChild(card);
      } else {
        paidContainer.appendChild(card);
      }
    });
  }
  
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/user-dashboard/index.html"; // update path as needed
  });
  
  renderCharges();
  