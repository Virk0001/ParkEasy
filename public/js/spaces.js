const urlParams = new URLSearchParams(window.location.search);
const lotName = urlParams.get('lot') || 'Unknown';
document.getElementById("lotTitle").textContent = `🔲 Lot ${lotName}`;

// Simulated parking space status (in real scenario, this will come from backend)
const spaceData = JSON.parse(localStorage.getItem(`spaces_${lotName}`)) || Array(20).fill(false); // 20 spaces, false = empty

const spaceGrid = document.getElementById("spaceGrid");

spaceData.forEach((isOccupied, index) => {
  const div = document.createElement("div");
  div.className = `space ${isOccupied ? 'occupied' : 'empty'}`;
  div.textContent = `#${index + 1}`;
  spaceGrid.appendChild(div);
});

// Optional: to simulate toggling space status for demo/testing
// Uncomment this if needed:
// document.querySelectorAll(".space").forEach((el, i) => {
//   el.onclick = () => {
//     spaceData[i] = !spaceData[i];
//     localStorage.setItem(`spaces_${lotName}`, JSON.stringify(spaceData));
//     location.reload();
//   };
// });
