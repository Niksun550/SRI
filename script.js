import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAkwiKjPYsv4LlRQLTxH6kj15xlCnvoXKA",
    authDomain: "testmenu-4ed51.firebaseapp.com",
    projectId: "testmenu-4ed51",
    storageBucket: "testmenu-4ed51.appspot.com",
    messagingSenderId: "98263305480",
    appId: "1:98263305480:web:024158941cb5f53225f0bd",
    measurementId: "G-CX0JDH1RDP"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Menu Data (with valid images)
const menu = [
    { id: 1, name: "Pizza", price: 299, image: "https://placehold.co/150" },
    { id: 2, name: "Burger", price: 199, image: "https://placehold.co/150" },
    { id: 3, name: "Pasta", price: 249, image: "https://placehold.co/150" },
    { id: 4, name: "Salad", price: 149, image: "https://placehold.co/150" }
];

// ✅ Cart & Order Variables
let cart = {};
let currentOrder = { table: null, status: "Pending" };

// ✅ Load Menu Items
function loadMenu() {
    let menuContainer = document.getElementById("menu-items");
    menuContainer.innerHTML = "";
    menu.forEach(item => {
        menuContainer.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow text-center">
                <img src="${item.image}" class="w-full h-32 object-cover rounded">
                <h3 class="text-lg font-bold mt-2">${item.name}</h3>
                <p class="text-gray-600">₹${item.price.toFixed(2)}</p>
                <button onclick="addToCart(${item.id})" class="bg-red-600 text-white px-4 py-2 mt-2 rounded w-full">➕ Add to Order</button>
            </div>
        `;
    });
}

// ✅ Add Item to Cart
function addToCart(id) {
    if (!cart[id]) cart[id] = { ...menu.find(m => m.id === id), quantity: 0 };
    cart[id].quantity += 1;
    updateOrder();
}

// ✅ Update Order UI
function updateOrder() {
    let orderList = document.getElementById("order-items");
    let totalPrice = 0;
    orderList.innerHTML = "";

    Object.values(cart).forEach(item => {
        totalPrice += item.price * item.quantity;
        orderList.innerHTML += `<li class="py-2">${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>`;
    });

    document.getElementById("total-price").innerText = totalPrice.toFixed(2);
}

// ✅ Place Order & Save to Firebase
async function placeOrder() {
    let selectedTable = document.getElementById("table-select").value;
    if (!selectedTable) return alert("Please select a table!");
    if (Object.keys(cart).length === 0) return alert("Your order is empty!");

    try {
        let orderItems = Object.values(cart).map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        let order = {
            table: selectedTable,
            status: "Pending",
            items: orderItems,
            timestamp: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, "orders"), order);
        console.log("Order placed with ID: ", docRef.id);

        // ✅ Update UI
        currentOrder.table = selectedTable;
        document.getElementById("order-table").innerText = selectedTable;
        document.getElementById("order-status-text").innerText = "Confirmed";
        cart = {};
        updateOrder();
        alert("Order placed successfully!");
        showSection('order-status');

    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Check console for details.");
    }
}

// ✅ Show Section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Load Menu on Page Load
loadMenu();
