const socket = io(); // 🔌 Connect to backend

const tableBody = document.getElementById('order-table-body');

// Load existing orders on first load
fetch('/api/orders')
  .then(res => res.json())
  .then(data => {
    data.forEach(renderOrderRow);
  });

// Listen for real-time new order
socket.on('newOrder', (order) => {
  renderOrderRow(order);
});

// Render a new row in the table
function renderOrderRow(order) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${order.id}</td>
    <td>${order.name}</td>
    <td>${order.items.join(', ')}</td>
    <td>${order.status}</td>
  `;
  tableBody.prepend(tr); // Show most recent on top
}

