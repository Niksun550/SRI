// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkwiKjPYsv4LlRQLTxH6kj15xlCnvoXKA",
  authDomain: "testmenu-4ed51.firebaseapp.com",
  projectId: "testmenu-4ed51",
  storageBucket: "testmenu-4ed51.firebasestorage.app",
  messagingSenderId: "98263305480",
  appId: "1:98263305480:web:024158941cb5f53225f0bd",
  measurementId: "G-CX0JDH1RDP"
};

firebase.initializeApp(firebaseConfig);

// 👇 Attach the database object globally if needed
const database = firebase.database();
