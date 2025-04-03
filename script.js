import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkwiKjPYsv4LlRQLTxH6kj15xlCnvoXKA",
    authDomain: "testmenu-4ed51.firebaseapp.com",
    projectId: "testmenu-4ed51",
    storageBucket: "testmenu-4ed51.firebasestorage.app",
    messagingSenderId: "98263305480",
    appId: "1:98263305480:web:024158941cb5f53225f0bd",
    measurementId: "G-CX0JDH1RDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let cart = {};
let currentOrder = { table: null, status: "Pending" };

function placeOrder() {
    let selectedTable = document.getElementById("table-select").value;
    if (!selectedTable) return alert("Please select a table!");
    if (Object.keys(cart).length === 0) return alert("Your order is empty!");

    currentOrder = {
        table: selectedTable,
        items: Object.values(cart),
        status: "Confirmed",
        timestamp: new Date()
    };

    addDoc(collection(db, "orders"), currentOrder)
        .then(() => {
            document.getElementById("order-table").innerText = selectedTable;
            document.getElementById("order-status-text").innerText = "Confirmed";
            cart = {};
            updateOrder();
            alert("Order placed successfully!");
            showSection('order-status');
        })
        .catch(error => {
            alert("Error placing order: " + error.message);
        });
}

// Listen for order updates in real-time
onSnapshot(collection(db, "orders"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
            const order = change.doc.data();
            if (order.table === currentOrder.table) {
                document.getElementById("order-status-text").innerText = order.status;
            }
        }
    });
});
