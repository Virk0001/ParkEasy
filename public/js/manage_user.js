const searchInput = document.getElementById("searchInput");
const userTableBody = document.getElementById("userTableBody");

searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = userTableBody.getElementsByTagName("tr");

  for (let row of rows) {
    const name = row.cells[0].textContent.toLowerCase(); // Assuming Name is the first column
    row.style.display = name.includes(filter) ? "" : "none";
  }
});
