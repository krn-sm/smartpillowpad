# 💤 Smart Pillow Pad

An IoT-based real-time **Sleep Monitoring System** using an ESP32 microcontroller. The pillow tracks sleep data via sensors and sends it wirelessly to a cloud dashboard using **MQTT** and **Firebase**.

---

## 🎯 Project Goals

- 🛌 Track sleep posture and movement using pressure sensors
- ❤️ Monitor heart rate and SpO2 levels using MAX30102
- 📊 Visualize real-time data on a custom web dashboard
- ☁️ Store and analyze sleep data with Firebase

---

## 🧠 Components Used

| Component      | Purpose                                  |
|----------------|------------------------------------------|
| **ESP32** | Core microcontroller + WiFi & BLE  |
| **FSR Sensors (x4)** | Detect body pressure points          |
| **MAX30102**    | Heart rate & SpO2 measurement           |
| **MPU6050**     | Movement and orientation detection      |

---

## 🛠 Tech Stack

- **C++ / Arduino**
- **MQTT (Mosquitto Broker)** for real-time data transmission
- **Firebase** for user data storage and authentication
- **HTML/CSS + JS** for frontend dashboard
  
---

## 🖼️ Screenshots
![Screenshot1](./images/Screenshot%2025-03-31%172201.png)
![Screenshot2](./images/Screenshot%2025-03-31%174435.png)
![Screenshot3](./images/Screenshot%2025-03-31%223158.png)
![Screenshot4](./images/Screenshot%2025-03-31%223915.png)

---

## 🚀 Future Features

- BLE-based mobile app (Flutter)
- Auto alarm tuning using ML




