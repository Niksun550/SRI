db.collection("orders")
  .orderBy("timestamp", "desc")
  .onSnapshot(snapshot => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderDashboardOrders(orders);
  });

function renderDashboardOrders(orders) {
  const container = document.getElementById("ordersList");
  container.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.margin = "10px";
    card.style.background = "#fff";

    card.innerHTML = `
      <strong>🪑 Table:</strong> ${order.tableNo}<br>
      <strong>👤 Name:</strong> ${order.custName}<br>
      <strong>📞 Mobile:</strong> ${order.mobile}<br>
      <strong>🕒 Time:</strong> ${new Date(order.timestamp).toLocaleString()}<br>
      <strong>🧾 Items:</strong>
      <ul>
        ${order.items.map(item => `<li>${item.name} x${item.qty} = ₹${item.qty * item.price}</li>`).join("")}
      </ul>
      <strong>💵 Total:</strong> ${order.total}
      <br><strong>📦 Status:</strong> ${order.status}
    `;

    container.appendChild(card);
  });
}
