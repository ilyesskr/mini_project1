// index de la question en curs
let currentQuestionIndex = 0;
// variable pour stocker l'intervalle du timer
let timer;
// temps restant pour chaque question
let timeLeft = 10; 
let score = 0;
// tableau pour stocker les questions récupérées via l'API
let questions = [];

// Gestion de la soumission du formulaire de configuration du quiz
document.getElementById('quiz-config').addEventListener('submit', function(event) {
    // empecher le rechargement de la page lors de la soumission
    event.preventDefault();

    // recupération des valeurs de configuration depuis le formulaire
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    const amount = document.getElementById('amount').value;

    // appel à l'API Open Trivia Database avec les parametres recuperes
    fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`)
        .then(response => response.json())
        .then(data => {
            // si la requete est reussie
            if (data.response_code === 0) {
                // stockage des questions recuperees
                questions = data.results;
                // masquer la section de configuration
                document.querySelector('.config-container').style.display = 'none';
                // afficher la section du quiz
                document.getElementById('quiz-container').style.display = 'block';
                // afficher les questions du quiz
                displayQuiz(questions);
            } else {
                // en cas d'erreur lors de la recuperation des questions
                alert('Failed to fetch questions. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
});

// fonction pour afficher le quiz en generant les elements HTML pour chaque question
function displayQuiz(questions) {
    const quizContainer = document.getElementById('quiz-container');
    // reinitialiser le contenu du conteneur du quiz
    quizContainer.innerHTML = '';

    // parcourir toutes les questions
    questions.forEach((question, index) => {
        // creer un element div pour chaque question
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        // attribuer un id unique a chaque question
        questionElement.setAttribute('id', `question-${index}`);
        // inserer le contenu de la question, le timer et le formulaire de reponses
        questionElement.innerHTML = `
            <h2>Question ${index + 1}:</h2>
            <p>${question.question}</p>
            <div class="timer" id="timer-${index}">Time left: ${timeLeft} seconds</div>
            <form id="form-${index}">
                ${generateOptions(question, index)}
            </form>
        `;
        // ajouter la question au conteneur principal du quiz
        quizContainer.appendChild(questionElement);
    });

    // afficher la premiere question
    showQuestion(currentQuestionIndex);
}

// fonction pour generer les options de reponses pour une question donnee
function generateOptions(question, index) {
    // combiner les mauvaises reponses avec la bonne reponse
    const options = [...question.incorrect_answers, question.correct_answer];
    // melanger les options pour les afficher dans un ordre aleatoire
    options.sort(() => Math.random() - 0.5);

    // creer le code HTML pour chaque option de réponse
    return options.map(option => `
        <label>
            <input type="radio" name="answer-${index}" value="${option}">
            ${option}
        </label><br>
    `).join('');
}

// fonction pour afficher une question specifique selon son index
function showQuestion(index) {
    // recuperer toutes les questions affichees
    const questions = document.querySelectorAll('.question');
    // afficher uniquement la question correspondant a l'index et masquer les autres
    questions.forEach((question, i) => {
        question.style.display = i === index ? 'block' : 'none';
    });

    // demarrer le timer pour la question actuelle
    startTimer(index);
}

// fonction pour demarrer le timer pour la question affichee
function startTimer(index) {
    // reinitialiser le temps restant a 10 secondes
    timeLeft = 10;
    const timerElement = document.getElementById(`timer-${index}`);
    timerElement.textContent = `Time left: ${timeLeft} seconds`;

    // mettre en place un intervalle pour decompter chaque seconde
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft} seconds`;

        // lorsque le temps est ecoule, arreter le timer et gerer le timeout
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout(index);
        }
    }, 1000);
}

// fonction appelee lorsque le temps imparti pour une question est ecoule
function handleTimeout(index) {
    alert('Time is up! Moving to the next question.');
    nextQuestion();
}

// fonction pour passer a la question suivante
function nextQuestion() {
    const questions = document.querySelectorAll('.question');
    // si il reste des questions, incrementer l'index et afficher la suivante
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        // si toutes les questions ont ete traitees, terminer le quiz
        endQuiz();
    }
}

// fonction pour calculer le score final (non utilisee dans ce code, mais presente si besoin)
function calculateScore() {
    const questions = document.querySelectorAll('.question');
    questions.forEach((question, index) => {
        // recuperer la reponse selectionnee pour chaque question
        const selectedAnswer = document.querySelector(`#form-${index} input[name="answer-${index}"]:checked`);
        // verifier si la réponse selectionnee est correcte
        if (selectedAnswer && selectedAnswer.value === questions[index].correct_answer) {
            score++;
        }
    });

    alert(`Your score is ${score} out of ${questions.length}`);
}

// fonction appelee a la fin du quiz pour afficher le score final et proposer de redemarrer
function endQuiz() {
    clearInterval(timer);
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h2>Quiz Over!</h2>
        <p>Your final score is ${score} out of ${questions.length}.</p>
        <button onclick="location.reload()">Restart Quiz</button>
    `;
}

// Écouteur d'evenement pour detecter la selection d'une reponse (changement sur les inputs radio)
document.addEventListener('change', function(event) {
    // verifier que l'element modifie correspond a un input de réponse
    if (event.target.matches('input[name^="answer-"]')) {
        // arreter le timer des qu'une reponse est selectionnee
        clearInterval(timer);
        const selectedAnswer = event.target.value;
        // recuperer la question actuelle depuis le tableau des questions
        const currentQuestion = questions[currentQuestionIndex];

        // verifier si la réponse sélectionnée est correcte et incrementer le score si c'est le cas
        if (selectedAnswer === currentQuestion.correct_answer) {
            score++;
        }

        // passer a la question suivante
        nextQuestion();
    }
});
