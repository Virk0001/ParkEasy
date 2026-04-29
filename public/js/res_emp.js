document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const tableRows = document.querySelectorAll("#reservationTableBody tr");
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
  
      tableRows.forEach(row => {
        const userCell = row.children[1].textContent.toLowerCase();
        const vehicleCell = row.children[2].textContent.toLowerCase();
  
        if (userCell.includes(query) || vehicleCell.includes(query)) {
          row.style.display = ""; // Show matching row
        } else {
          row.style.display = "none"; // Hide non-matching row
        }
      });
    });
  });
  