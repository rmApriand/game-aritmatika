document.addEventListener("DOMContentLoaded", function() {
  const questionContainer = document.getElementById("question-container");
  const optionsContainer = document.getElementById("options-container");
  const resultContainer = document.getElementById("result-container");
  const nextButton = document.getElementById("next-btn");

  const maxQuestions = 10;
  let skorPengurangan = 0;  
  let questionCount = 0;

  const images = [
    "../../asset/images/gambar9.jpg", 
    "../../asset/images/kurang/gambar9-kurang.jpg" 
  ];

  function generateQuestion() {
    const totalImages = getRandomInt(5, 10);
    const rottenImageCount = getRandomInt(1, totalImages - 1);
    const freshImageCount = totalImages - rottenImageCount;

    return { totalImages, freshImageCount, rottenImageCount };
  }

  function displayQuestion(question) {
    questionContainer.innerHTML = '';

    for (let i = 0; i < question.freshImageCount; i++) {
      const img = document.createElement('img');
      img.src = images[0];
      img.alt = 'Apel Bagus';
      img.classList.add('question-image');
      questionContainer.appendChild(img);
    }

    for (let i = 0; i < question.rottenImageCount; i++) {
      const img = document.createElement('img');
      img.src = images[1];
      img.alt = 'Apel Busuk';
      img.classList.add('question-image');
      questionContainer.appendChild(img);
    }
  }

  function generateOptions(correctAnswer, totalImages, rottenImageCount) {
    const correctOption = `${totalImages} - ${rottenImageCount} = ${correctAnswer}`;
    const incorrectOptions = [];

    while (incorrectOptions.length < 4) {
      const randomFreshCount = getRandomInt(1, totalImages - 1);
      const randomOption = `${totalImages} - ${totalImages - randomFreshCount} = ${randomFreshCount}`;
      if (randomOption !== correctOption && !incorrectOptions.includes(randomOption)) {
        incorrectOptions.push(randomOption);
      }
    }

    const options = [correctOption, ...incorrectOptions];
    options.sort(() => Math.random() - 0.5);

    return options;
  }

  function displayOptions(options, correctAnswer) {
    optionsContainer.innerHTML = '';

    options.forEach(option => {
      const btn = document.createElement('button');
      btn.classList.add('option-btn');
      btn.textContent = option;
      btn.addEventListener('click', () => checkAnswer(option, correctAnswer));
      optionsContainer.appendChild(btn);
    });
  }

  function checkAnswer(selected, correct) {
    resultContainer.innerHTML = '';
    if (selected === correct) {
      resultContainer.innerHTML = "<span style='color: green;'>✓</span> Jawaban Benar!";
      resultContainer.style.backgroundColor = "#d4edda";
      resultContainer.style.color = "#155724";
      skorPengurangan += 10;  
    } else {
      resultContainer.innerHTML = `<span style='color: red;'>✗</span> Salah. Jawaban yang benar adalah ${correct}`;
      resultContainer.style.backgroundColor = "#f8d7da";
      resultContainer.style.color = "#721c24";
    }

    nextButton.style.display = 'block';
  }

  function nextQuestion() {
    questionCount++;
    if (questionCount < maxQuestions) {
      init();
    } else {
      submitScore();
      resultContainer.innerHTML = `Permainan selesai! Skor akhir Anda adalah ${skorPengurangan}.`;
      resultContainer.innerHTML += `<p><a href="../../leaderboard.html" class="return-btn">Lihat Skor Totalmu</a></p>`;
      nextButton.style.display = 'none'; 
    }
  }

  function init() {
    const question = generateQuestion();
    const correctAnswer = question.freshImageCount;
    const options = generateOptions(correctAnswer, question.totalImages, question.rottenImageCount);

    displayQuestion(question);
    displayOptions(options, `${question.totalImages} - ${question.rottenImageCount} = ${correctAnswer}`);
    
    resultContainer.innerHTML = '';
    resultContainer.style.backgroundColor = 'white';
    resultContainer.style.color = 'black';
    nextButton.style.display = 'none';
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  nextButton.addEventListener('click', nextQuestion);

  function submitScore() {
    fetch('../../score_pengurangan.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: skorPengurangan, type: 'pengurangan' }), 
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        console.log(data.message);
      } else {
        console.error(data.message);
      }
    })
    .catch(error => console.error('Error:', error));
  }

  init();
});
