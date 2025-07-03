//const tidak akan berubah nilainya
const images = [
  "../../asset/images/gambar1.jpg",
  "../../asset/images/gambar2.jpg",
  "../../asset/images/gambar3.jpg",
];
const maxQuestions = 10;
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const resultContainer = document.getElementById("result-container");
const nextButton = document.getElementById("next-btn");

//let itu nilainya bisa berubah
let correctCounts = generateCorrectCounts();
let options = [];
let score = 0;
let questionCount = 0;

function generateCorrectCounts() {
  const counts = [];
  for (let i = 0; i < images.length; i++) {
    counts.push(Math.floor(Math.random() * 5) + 1);
  }
  return counts.join("+");
}

//math.random nilainya 0 dan 1 dan * 5 maka nilainya akan 0 dan 5, math.floor itu untuk membulatkan desimal ke bawah jadi nilainya (0,1,2,3,4) terus ditambah 1 biar nilainya jadi 1,2,3,4,5 dan for itu langsung keluar 3 angka [x,x,x]
//cek di consol web
// generateCorrectCounts();

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
//map untuk menghasilkan nilai acak antara 1 dan 5 untuk setiap gambar yang ada di array images

function generateOptions() {
  options = [];
  options.push({ value: correctCounts, text: calculateValue(correctCounts) });
  //misalnya di correctCounts nlainya "1+2+3", value itu nilainya "1+2+3" dan text nilainya "=6"

  const fakeCounts = generateFakeCounts();
  fakeCounts.forEach((fakeCount) => {
    options.push({ value: fakeCount, text: calculateValue(fakeCount) });
  });

  options.sort(() => Math.random() - 0.5);
  //untuk mengacak urutan pake fungsi sort yang menghasilkan nilai acak positif atau negatif.
}

//menerima parameter countsString yang dipisah tanda +, misal "1+2+3"
function calculateValue(countsString) {
  const countsArray = countsString.split("+").map(Number);
  //ggra split dia jadi "1+2+3", di map jadi  [1, 2, 3]
  const sum = countsArray.reduce((total, count) => total + count, 0);
  return `= ${sum}`;
}

function displayQuestion() {
  questionContainer.innerHTML = "";
  //ngosongin konten di questionContainer
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
  //dipanggil untuk menghasilkan opsi jawaban

  optionsContainer.innerHTML = "";
  options.forEach((option) => {
    const optionBtn = document.createElement("button");
    optionBtn.textContent = option.value + " " + option.text;
    //buat opsi di buttonnya value + text tadi
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

//buat nonaktifin tombol pilihan pas jawabannya udh keluar.
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

//buat aktifin kembali tombol tadi
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
//memanggil displayQuestion() di awal