document.addEventListener("DOMContentLoaded", () => {
  const logDateInput = document.getElementById("logDate");
  const userSearchInput = document.getElementById("userSearch");
  const vehicleSearchInput = document.getElementById("vehicleSearch");
  const logTableBody = document.getElementById("logTableBody");
  const today = new Date().toISOString().slice(0, 10);
  logDateInput.value = today;

  async function loadLogs(date, user = "", vehicle = "") {
    logTableBody.innerHTML = "";
    try {
      const response = await fetch(`/api/logs?date=${date}&user=${encodeURIComponent(user)}&vehicle=${encodeURIComponent(vehicle)}`);
      const logs = await response.json();

      if (logs.length === 0) {
        logTableBody.innerHTML =
          `<tr><td colspan="6" style="text-align:center">No logs for ${date}</td></tr>`;
        return;
      }

      logs.forEach(log => {
        const ts = new Date(log.timestamp);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${ts.toISOString().slice(0,10)}</td>
          <td>${ts.toLocaleTimeString()}</td>
          <td>${log.lot_name}</td>
          <td>${log.action}</td>
          <td>${log.user_name}</td>
          <td>${log.vehicle}</td>
        `;
        logTableBody.appendChild(row);
      });
    } catch (err) {
      console.error("Failed to load logs:", err);
      logTableBody.innerHTML =
        `<tr><td colspan="6" style="text-align:center;color:red">Error loading logs</td></tr>`;
    }
  }

  // Initial load
  loadLogs(today);

  // Event listeners
  function reloadLogs() {
    loadLogs(logDateInput.value, userSearchInput.value, vehicleSearchInput.value);
  }

  logDateInput.addEventListener("change", reloadLogs);
  userSearchInput.addEventListener("input", reloadLogs);
  vehicleSearchInput.addEventListener("input", reloadLogs);
});
