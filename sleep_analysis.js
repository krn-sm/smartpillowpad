import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const sleepDataRef = ref(db, "sensorData");

let currentStage = "Awake";
let awakeTime = 0;
let lightSleepTime = 0;
let deepSleepTime = 0;
let lastUpdateTime = Date.now();

// Listen for Data Updates
onValue(sleepDataRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log("📊 Sensor Data:", data);

    detectSleepStage(data);
    detectPosture(data);
  } else {
    console.log("❌ No sensor data found!");
  }
});

// Function to Detect Sleep Stage
function detectSleepStage(data) {
  let { heart_rate, mpu_ax, mpu_ay, mpu_az, fsr1, fsr2, fsr3, fsr4 } = data;

  let totalPressure = fsr1 + fsr2 + fsr3 + fsr4;
  let movement = Math.abs(mpu_ax) + Math.abs(mpu_ay) + Math.abs(mpu_az);
  let newStage = currentStage;

  // Sleep Stage Detection Using Movement + Heart Rate
  if (movement > 8000 || totalPressure === 0 || heart_rate > 80) {
    newStage = "Awake"; // High movement, no pressure, or high HR
  } else if (movement > 3000 || (heart_rate >= 50 && heart_rate <= 80)) {
    newStage = "Light Sleep"; // Some movement, normal HR
  } else if (movement < 2000 && heart_rate < 50) {
    newStage = "Deep Sleep"; // No movement, low HR
  }

  updateSleepTime(newStage);

  // Update UI
  document.getElementById("sleepStage").innerText = `${newStage}`;
  document.getElementById("awakeTime").innerText = `${awakeTime} mins`;
  document.getElementById("lightSleep").innerText = `${lightSleepTime} mins`;
  document.getElementById("deepSleep").innerText = `${deepSleepTime} mins`;

  if (newStage === "Awake") {
    triggerAlarm();
  }

  currentStage = newStage;
}

// Function to Detect Sleep Posture
function detectPosture(data) {
  let { fsr1, fsr2, fsr3, fsr4 } = data;
  let posture = "Detecting..."; // Default value

  // Ensure all FSR values are valid (avoid NaN issues)
  if (
    fsr1 === undefined ||
    fsr2 === undefined ||
    fsr3 === undefined ||
    fsr4 === undefined
  ) {
    posture = "Sensor Error";
  } else if (fsr1 > 0 && fsr2 > 0 && fsr3 > 0 && fsr4 > 0) {
    posture = "Back Sleeping"; // Even pressure distribution
  } else if (fsr4 > fsr3 && fsr4 > fsr1 && fsr4 > fsr2) {
    posture = "Left Side Sleeping"; // More pressure on left side
  } else if (fsr3 > fsr4 && fsr3 > fsr1 && fsr3 > fsr2) {
    posture = "Right Side Sleeping"; // More pressure on right side
  } else if (fsr1 > fsr3 && fsr1 > fsr4 && fsr2 > fsr3 && fsr2 > fsr4) {
    posture = "Stomach Sleeping"; // More pressure on upper & lower side
  }

  document.getElementById("postureText").innerText = `Posture: ${postureText}`;
}

// Function to Update Sleep Time

// Function to Calculate Sleep Score
function calculateSleepScore() {
  let totalTime = awakeTime + lightSleepTime + deepSleepTime;

  if (totalTime === 0) {
    return 0; // Avoid division by zero
  }

  let sleepScore =
    100 * ((0.4 * deepSleepTime + 0.3 * lightSleepTime) / totalTime);
  return Math.round(sleepScore); // Round to nearest whole number
}

// Update Sleep Time with Sleep Score Calculation
function updateSleepTime(newStage) {
  let now = Date.now();
  let elapsedTime = Math.floor((now - lastUpdateTime) / 60000);

  if (elapsedTime < 1) return;

  lastUpdateTime = now;

  if (newStage === "Awake") {
    awakeTime += elapsedTime;
  } else if (newStage === "Light Sleep") {
    lightSleepTime += elapsedTime;
  } else if (newStage === "Deep Sleep") {
    deepSleepTime += elapsedTime;
  }

  // Update Sleep Score in UI
  let sleepScore = calculateSleepScore();
  document.getElementById(
    "sleepScore"
  ).innerText = `Sleep Score: ${sleepScore}`;
}
