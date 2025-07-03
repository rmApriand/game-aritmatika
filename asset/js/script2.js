const images = [
  "../../asset/images/gambar4.jpg",
  "../../asset/images/gambar5.jpg",
  "../../asset/images/gambar6.jpg",
];

let correctCounts = generateCorrectCounts();
let options = [];
let score = 0;
let questionCount = 0;
const maxQuestions = 10;

const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const resultContainer = document.getElementById("result-container");
const nextButton = document.getElementById("next-btn");

resultContainer.style.backgroundColor = "#fff";
resultContainer.style.color = "#333";

function generateCorrectCounts() {
  const counts = [];
  for (let i = 0; i < images.length; i++) {
    counts.push(Math.floor(Math.random() * 5) + 1);
  }
  return counts.join("+");
}

function generateFakeCounts() {
  const fakeCounts = [];
  for (let i = 0; i < 4; i++) {
    const fakeCount = images
      .map(() => Math.floor(Math.random() * 5) + 1)
      .join("+");
    fakeCounts.push(fakeCount);
  }
  return fakeCounts;
}

function generateOptions() {
  options = [];
  options.push({ value: correctCounts, text: calculateValue(correctCounts) });

  const fakeCounts = generateFakeCounts();
  fakeCounts.forEach((fakeCount) => {
    options.push({ value: fakeCount, text: calculateValue(fakeCount) });
  });

  options.sort(() => Math.random() - 0.5);
}

function calculateValue(countsString) {
  const countsArray = countsString.split("+").map(Number);
  const sum = countsArray.reduce((total, count) => total + count, 0);
  return `= ${sum}`;
}

function displayQuestion() {
  questionContainer.innerHTML = "";

  correctCounts = generateCorrectCounts();
  const counts = correctCounts.split("+").map(Number);
  counts.forEach((count, index) => {
    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = images[index];
      img.classList.add("game-image");
      questionContainer.appendChild(img);
    }
  });

  generateOptions();

  optionsContainer.innerHTML = "";
  options.forEach((option) => {
    const optionBtn = document.createElement("button");
    optionBtn.textContent = option.value + " " + option.text;
    optionBtn.classList.add("option-btn");
    optionBtn.addEventListener("click", () => checkAnswer(option.value));
    optionsContainer.appendChild(optionBtn);
  });
}

function checkAnswer(selectedOption) {
  const selectedValue = options.find(
    (option) => option.value === selectedOption
  )?.text;

  const correctValue = calculateValue(correctCounts);

  if (selectedOption === correctCounts) {
    resultContainer.innerHTML = "<span style='color: green;'>✓</span> Jawaban Benar!";
    resultContainer.style.backgroundColor = "#d4edda";
    resultContainer.style.color = "#155724";
    resultContainer.textContent += ` Nilainya ${correctValue}`;
    score += 10;
  } else {
    resultContainer.innerHTML = `<span style='color: red;'>✗</span> Salah. Jawaban yang benar adalah ${correctCounts} Nilainya ${correctValue}`;
    resultContainer.style.backgroundColor = "#f8d7da";
    resultContainer.style.color = "#721c24";
  }

  disableOptions();
  nextButton.style.display = "block";
}

function disableOptions() {
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.disabled = true;
  });
}

function nextQuestion() {
  questionCount++;
  if (questionCount < maxQuestions) {
    displayQuestion();
    resultContainer.textContent = "";
    resultContainer.style.backgroundColor = "#fff";
    resultContainer.style.color = "#333";
    enableOptions();
    nextButton.style.display = "none";
  } else {
    submitScore();
  }
}

function enableOptions() {
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.disabled = false;
  });
}

function submitScore() {
  fetch('../../submit_score.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ score: score })
  })
  .then(response => response.json())
  .then(data => {
    resultContainer.innerHTML = `<h3>Quiz selesai! Skor Anda adalah ${score}.</h3>`;
    resultContainer.innerHTML += `<p><a href="../../leaderboard.html" class="return-btn">Lihat Skor Totalmu</a></p>`;
    nextButton.style.display = 'none'; 
  })
  .catch(error => console.error('Error:', error));
}


nextButton.addEventListener("click", nextQuestion);

displayQuestion();