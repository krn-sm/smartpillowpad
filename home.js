// Import Firebase modules (Ensure Firebase v10+ is used)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL:
    "https://smart-sleep-pad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("✅ Firebase initialized successfully!");

// References
const dataRef = ref(db, "sensorData");
const recordingRef = ref(db, "settings/recording");

let isRecording = false; // Flag to track recording state

// Function to update FSR button colors
function updateFSRButtons(data) {
  const fsrIds = ["fsr1", "fsr2", "fsr3", "fsr4"];

  fsrIds.forEach((id, index) => {
    const fsrValue = data[id] || 0;
    const button = document.getElementById(id);

    if (button) {
      if (fsrValue > 0) {
        button.style.backgroundColor = "green";
      } else {
        button.style.backgroundColor = "red";
      }
    }
  });
}

function updatePresenceMessage(data) {
  const presenceElement = document.getElementById("presenceMessage");
  const heartRateElement = document.getElementById("heartRate");

  if (!presenceElement || !heartRateElement) return;

  // Check if ANY one of the FSR values is above 0
  const fsrValues = [data.fsr1, data.fsr2, data.fsr3, data.fsr4].map(
    (v) => v || 0
  );
  const presenceDetected = fsrValues.some((value) => value > 0);

  if (isRecording) {
    if (presenceDetected) {
      presenceElement.textContent = "Presence Detected";
      heartRateElement.textContent = data.heart_rate
        ? `${data.heart_rate} BPM`
        : "-- BPM"; // Show heart rate when recording
    } else {
      presenceElement.textContent = "Nobody Detected";
      heartRateElement.textContent = "-- BPM"; // Hide heart rate
    }
  } else {
    presenceElement.textContent = "Nobody Detected";
    heartRateElement.textContent = "-- BPM"; // Hide heart rate when not recording
  }
}

// Listen for real-time sensor data
onValue(dataRef, (snapshot) => {
  if (snapshot.exists()) {
    const latestData = Object.values(snapshot.val()).pop(); // Get latest entry
    console.log("📥 New Data Received:", latestData);
    updateFSRButtons(latestData);
    updatePresenceMessage(latestData);
  } else {
    console.log("❌ No data found in Firebase!");
  }
});

// Function to toggle recording state
function toggleRecording() {
  get(recordingRef)
    .then((snapshot) => {
      isRecording = snapshot.exists() ? !Boolean(snapshot.val().active) : true; // Toggle state
      return update(recordingRef, { active: isRecording });
    })
    .then(() => {
      const recordButton = document.getElementById("record-btn");
      if (recordButton) {
        recordButton.textContent = isRecording
          ? "⏹ Stop Recording"
          : "▶ Start Recording";
      }
      console.log(`🔴 Recording ${isRecording ? "Started" : "Stopped"}!`);
    })
    .catch((error) => {
      console.error("❌ Error updating recording status:", error);
    });
}

// Attach event listeners after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const recordButton = document.getElementById("record-btn");
  if (recordButton) {
    recordButton.addEventListener("click", toggleRecording);
  }
});
