let data = [];
let currentWeek = 1;
let currentQ = 0;
let score = 0;
let answers = [];

async function loadData() {
  const res = await fetch("questions.json");
  data = await res.json();
  createWeekButtons();
  loadQuestion();
}

function createWeekButtons() {
  const weeksDiv = document.getElementById("weeks");
  for (let i = 1; i <= 12; i++) {
    let btn = document.createElement("button");
    btn.innerText = "W" + i;
    btn.className = "px-3 py-1 bg-gray-700 rounded";
    btn.onclick = () => {
      currentWeek = i;
      currentQ = 0;
      score = 0;
      answers = [];
      highlightWeek();
      loadQuestion();
    };
    btn.id = "week" + i;
    weeksDiv.appendChild(btn);
  }
  highlightWeek();
}

function highlightWeek() {
  for (let i = 1; i <= 12; i++) {
    document.getElementById("week" + i)
      .classList.remove("bg-blue-500");
  }
  document.getElementById("week" + currentWeek)
    .classList.add("bg-blue-500");
}

function getWeekQuestions() {
  return data.filter(q => q.week === currentWeek);
}

function loadQuestion() {
  const questions = getWeekQuestions();
  if (!questions.length) return;

  const q = questions[currentQ];
  document.getElementById("question").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    let div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;

    div.onclick = () => selectAnswer(div, opt, q.answer);

    optionsDiv.appendChild(div);
  });

  updateProgress();
}

function selectAnswer(element, selected, correct) {
  const options = document.querySelectorAll(".option");

  options.forEach(opt => opt.classList.remove("correct", "wrong"));

  if (selected === correct) {
    element.classList.add("correct");
    score++;
  } else {
    element.classList.add("wrong");
    options.forEach(opt => {
      if (opt.innerText === correct) opt.classList.add("correct");
    });
  }

  document.getElementById("score").innerText =
    `${score}/${currentQ + 1} correct`;
}

function nextQ() {
  const questions = getWeekQuestions();
  if (currentQ < questions.length - 1) {
    currentQ++;
    loadQuestion();
  } else {
    alert(`Final Score: ${score}/${questions.length}`);
  }
}

function prevQ() {
  if (currentQ > 0) {
    currentQ--;
    loadQuestion();
  }
}

function updateProgress() {
  const questions = getWeekQuestions();
  let percent = ((currentQ + 1) / questions.length) * 100;

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    `Week ${currentWeek} - Q${currentQ + 1} of ${questions.length}`;
}

function restartQuiz() {
  currentQ = 0;
  score = 0;
  loadQuestion();
}

loadData();