// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA75H91rGFEKJZRLPgfOkEviDrzTOYVKQo",
  authDomain: "smart-sleep-pad.firebaseapp.com",
  databaseURL:
    "https://smart-sleep-pad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-sleep-pad",
  storageBucket: "smart-sleep-pad.appspot.com",
  messagingSenderId: "1033852250231",
  appId: "1:1033852250231:web:cd712231834c24093efe72",
  measurementId: "G-K6H846YXZL",
};

// Initialize Firebase (Only initialize if not already initialized)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.auth = firebase.auth();
window.database = firebase.database();
console.log("✅ Firebase initialized and assigned to window.");
