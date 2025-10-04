document.getElementById("surveyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const q1 = parseInt(form.q1.value);
  const q2 = parseInt(form.q2.value);
  const q3 = parseInt(form.q3.value);

  const totalScore = q1 + q2 + q3;

  document.getElementById("results").classList.remove("hidden");

  const ctx = document.getElementById("resultsChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Back Pain", "Sitting Hours", "Exercise"],
      datasets: [{
        label: "Score Breakdown",
        data: [q1, q2, q3],
        backgroundColor: ["#ff6384", "#36a2eb", "#4bc0c0"]
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 5 }
      }
    }
  });
});