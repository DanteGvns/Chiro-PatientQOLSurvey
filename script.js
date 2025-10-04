async function loadQuestions() {
  const response = await fetch("questions.json");
  const questions = await response.json();
  const form = document.getElementById("surveyForm");

  questions.forEach(q => {
    const wrapper = document.createElement("div");
    wrapper.className = "question";
    wrapper.innerHTML = `<label>${q.text}</label><div class="scale">${generateScale(q.id)}</div>`;
    form.insertBefore(wrapper, form.lastElementChild);
  });
}

function generateScale(name) {
  let html = "";
  for (let i = 1; i <= 10; i++) {
    html += `<label><input type="radio" name="${name}" value="${i}" required />${i}</label>`;
  }
  return html;
}

document.getElementById("surveyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const response = await fetch("questions.json");
  const questions = await response.json();
  const formData = new FormData(e.target);

  const patientName = formData.get("patientName");
  const assessmentDate = formData.get("assessmentDate");

  let scores = { mental: 0, mechanical: 0, chemical: 0 };
  let counts = { mental: 0, mechanical: 0, chemical: 0 };

  questions.forEach(q => {
    const val = parseInt(formData.get(q.id));
    scores[q.category] += val;
    counts[q.category]++;
  });

  const averages = {
    mental: scores.mental / counts.mental,
    mechanical: scores.mechanical / counts.mechanical,
    chemical: scores.chemical / counts.chemical,
    overall: (scores.mental + scores.mechanical + scores.chemical) / (counts.mental + counts.mechanical + counts.chemical)
  };

  renderChart(averages, patientName, assessmentDate);
});

function renderChart(data, name, date) {
  document.getElementById("results").classList.remove("hidden");

  const container = document.getElementById("results");
  container.innerHTML = `
    <h2>Your Health Profile</h2>
    <p><strong>Patient Name:</strong> ${name}</p>
    <p><strong>Date of Assessment:</strong> ${date}</p>
    ${renderBar("Overall Health", data.overall)}
    ${renderBar("Mental Health", data.mental, true)}
    ${renderBar("Mechanical Health", data.mechanical, true)}
    ${renderBar("Chemical Health", data.chemical, true)}
  `;
}

function renderBar(label, score, small = false) {
  const height = small ? "20px" : "30px";
  const fontSize = small ? "14px" : "16px";
  const filledPercent = (score / 10) * 100;

  return `
    <div style="margin-bottom: 15px;">
      <div style="font-size:${fontSize}; margin-bottom: 5px;">${label}: ${score.toFixed(1)}/10</div>
      <div style="position: relative; width: 100%; height: ${height}; background: #ddd; border-radius: 5px; overflow: hidden;">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: ${height};
          background: linear-gradient(to right,
            red 0%,
            orange 20%,
            yellow 40%,
            lightgreen 70%,
            green 100%);
        "></div>
        <div style="
          position: absolute;
          top: 0;
          left: ${filledPercent}%;
          width: ${100 - filledPercent}%;
          height: ${height};
          background: #ddd;
        "></div>
      </div>
    </div>
  `;
}

loadQuestions();