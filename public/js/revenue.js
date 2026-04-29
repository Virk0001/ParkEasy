document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("revenueTableBody");
  const chartCanvas = document.getElementById("revenueChart").getContext("2d");

  try {
    const response = await fetch("/api/revenue");
    const data = await response.json();

    // Populate table
    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date}</td>
        <td>${row.total_reservations}</td>
        <td>₹${row.total_fines}</td>
        <td>₹${row.total_revenue}</td>
      `;
      tableBody.appendChild(tr);
    });

    // Prepare chart data
    const labels = data.map(row => row.date);
    const revenues = data.map(row => parseFloat(row.total_revenue));
    const fines = data.map(row => parseFloat(row.total_fines));

    new Chart(chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Total Revenue (₹)",
            data: revenues,
            borderColor: "green",
            fill: false,
            tension: 0.1
          },
          {
            label: "Fines Collected (₹)",
            data: fines,
            borderColor: "red",
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Daily Revenue & Fines"
          }
        }
      }
    });

  } catch (err) {
    console.error("Failed to fetch revenue data:", err);
  }
});
