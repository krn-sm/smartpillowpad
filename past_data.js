document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("sleepChart").getContext("2d");

  // Fixed sleep stage durations (in minutes) for a 5-hour sleep session
  const sleepData = {
    Awake: 25,
    "Light Sleep": 130,
    "Deep Sleep": 105,
    "REM Sleep": 40,
  };

  // Calculate total sleep time
  const totalSleepMinutes = Object.values(sleepData).reduce((a, b) => a + b, 0);

  // Calculate sleep score (Example formula: More deep & REM sleep = higher score)
  let sleepScore = Math.round(
    ((sleepData["Deep Sleep"] * 2 + sleepData["REM Sleep"] * 1.5) /
      totalSleepMinutes) *
      100
  );
  sleepScore = Math.min(sleepScore, 100); // Ensure score doesn't exceed 100

  // Update the sleep score on the page
  document.getElementById("sleepScore").innerText = sleepScore;

  // Generate the bar chart
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(sleepData),
      datasets: [
        {
          label: "Time in Minutes",
          data: Object.values(sleepData),
          backgroundColor: ["#ff4d4d", "#ffcc00", "#009933", "#3399ff"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Minutes",
          },
        },
      },
    },
  });

  // Define sleep tips and feedback messages
  let tip, feedback;

  if (sleepScore >= 85) {
    tip = "Great job! Keep maintaining a consistent sleep schedule.";
    feedback = "🌟 Amazing! Your sleep quality is excellent. Keep it up!";
  } else if (sleepScore >= 70) {
    tip = "Try to increase deep sleep by reducing screen time before bed.";
    feedback = "👍 Good job! But there's room for improvement.";
  } else if (sleepScore >= 50) {
    tip = "Consider a relaxing bedtime routine to improve deep sleep.";
    feedback = "😐 Not bad, but try to get better quality sleep.";
  } else {
    tip =
      "Avoid caffeine before bedtime and maintain a regular sleep schedule.";
    feedback =
      "😡 What are you doing?! Your sleep quality is terrible! Fix it!";
  }

  // Update the tip and feedback on the page
  document.getElementById("sleepTip").innerText = tip;
  document.getElementById("sleepFeedback").innerText = feedback;
});
