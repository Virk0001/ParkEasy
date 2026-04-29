const form = document.getElementById("paymentForm");
const methodSelect = document.getElementById("method");
const detailsContainer = document.getElementById("detailsContainer");
const confirmation = document.getElementById("confirmation");
const amountDisplay = document.getElementById("amountDisplay");
const confirmAmount = document.getElementById("confirmAmount");

const backBtn = document.getElementById("backBtn");
backBtn.onclick = () => history.back();

// Get amount from query param
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get("amount") || "0";
amountDisplay.textContent = amount;

methodSelect.addEventListener("change", () => {
  const method = methodSelect.value;
  detailsContainer.innerHTML = "";

  if (method === "card") {
    detailsContainer.innerHTML = `
      <label>Card Number:</label>
      <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" required />
      <label>Expiry:</label>
      <input type="month" required />
      <label>CVV:</label>
      <input type="password" maxlength="3" required />
    `;
  } else if (method === "upi") {
    detailsContainer.innerHTML = `
      <label>UPI ID:</label>
      <input type="text" placeholder="yourname@upi" required />
    `;
  } else if (method === "wallet") {
    detailsContainer.innerHTML = `
      <label>Select Wallet:</label>
      <select required>
        <option>Paytm</option>
        <option>PhonePe</option>
        <option>Google Pay</option>
      </select>
      <label>Registered Number:</label>
      <input type="text" placeholder="Enter phone number" required />
    `;
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  form.style.display = "none";
  confirmAmount.textContent = amount;
  confirmation.style.display = "block";
});
