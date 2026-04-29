const lots = [
    { id: 1, name: "Lot A" },
    { id: 2, name: "Lot B" },
    { id: 3, name: "Lot C" }
  ];
  
  const container = document.getElementById("lotsContainer");
  
  lots.forEach(lot => {
    const card = document.createElement("div");
    card.className = "lot-card";
    card.textContent = lot.name;
    card.addEventListener("click", () => {
      // Redirect to manage spaces with lot id
      window.location.href = `/employee-dashboard/manage-spaces/index.html?lotId=${lot.id}&lotName=${encodeURIComponent(lot.name)}`;
    });
    container.appendChild(card);
  });
  
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/employee-dashboard/index.html";
  });
  