// Sample vocabulary questions
const vocabularyQuestions = [
    {
        word: "Apple",
        options: ["蘋果", "香蕉", "橘子", "葡萄"],
        correctAnswer: 0
    },
    {
        word: "Book",
        options: ["電腦", "書本", "手機", "鉛筆"],
        correctAnswer: 1
    },
    {
        word: "Cat",
        options: ["狗", "兔子", "貓", "老鼠"],
        correctAnswer: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let isAnswered = false;

// DOM elements
const currentWordElement = document.getElementById('current-word');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const timerElement = document.getElementById('timer');
const audioButton = document.getElementById('audio-btn');
const feedbackElement = document.getElementById('feedback');

// Initialize quiz
function initializeQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add('hidden');
    nextButton.classList.add('hidden');
    feedbackElement.classList.add('hidden');
    displayQuestion();
}

// Display current question
function displayQuestion() {
    isAnswered = false;
    const currentQuestion = vocabularyQuestions[currentQuestionIndex];
    
    currentWordElement.textContent = currentQuestion.word;
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });

    feedbackElement.classList.add('hidden');
    nextButton.classList.add('hidden');
    startTimer();
}

// Timer functionality
function startTimer() {
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    
    if (timer) {
        clearInterval(timer);
    }
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!isAnswered) {
                handleTimeout();
            }
        }
    }, 1000);
}

// Handle timeout
function handleTimeout() {
    isAnswered = true;
    clearInterval(timer);
    
    const options = optionsContainer.children;
    const currentQuestion = vocabularyQuestions[currentQuestionIndex];
    
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('correct', 'wrong');
        if (i === currentQuestion.correctAnswer) {
            options[i].classList.add('correct');
        }
    }
    
    feedbackElement.textContent = "時間到！正確答案已標示";
    feedbackElement.className = 'wrong';
    feedbackElement.classList.remove('hidden');
    nextButton.classList.remove('hidden');
}

// Handle option selection
function selectOption(selectedIndex) {
    if (isAnswered) return;
    
    isAnswered = true;
    clearInterval(timer);
    
    const currentQuestion = vocabularyQuestions[currentQuestionIndex];
    const options = optionsContainer.children;
    
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('correct', 'wrong');
        if (i === currentQuestion.correctAnswer) {
            options[i].classList.add('correct');
        } else if (i === selectedIndex) {
            options[i].classList.add('wrong');
        }
    }

    if (selectedIndex === currentQuestion.correctAnswer) {
        score++;
        feedbackElement.textContent = "答對了！";
        feedbackElement.className = 'correct';
    } else {
        feedbackElement.textContent = "答錯了！正確答案已標示";
        feedbackElement.className = 'wrong';
    }
    
    feedbackElement.classList.remove('hidden');
    nextButton.classList.remove('hidden');
}

// Audio pronunciation functionality
audioButton.addEventListener('click', () => {
    const word = vocabularyQuestions[currentQuestionIndex].word;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
});

// Handle next button click
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < vocabularyQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
});

// Show final results
function showResults() {
    clearInterval(timer);
    currentWordElement.textContent = '';
    optionsContainer.innerHTML = '';
    nextButton.classList.add('hidden');
    feedbackElement.classList.add('hidden');
    timerElement.style.display = 'none';
    resultContainer.classList.remove('hidden');
    scoreElement.textContent = `${score}/${vocabularyQuestions.length}`;
}

// Handle restart button click
restartButton.addEventListener('click', () => {
    timerElement.style.display = 'block';
    initializeQuiz();
});

// Start the quiz
initializeQuiz();
