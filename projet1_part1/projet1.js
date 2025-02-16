var i = 0;//initialisation des variables
var start = document.getElementById(0);
var score = document.getElementById("val");
var counter = 0;
var sec = 1;
var interval = sec * 1000;
var time = 10;
var on = false;
var clock = document.getElementById("timer");
var timerId; 
let div_res=document.getElementById("container");
let res=document.getElementById("res");
let per=document.getElementById("per");
function decrement() {//fonction qui controle le timer
    if (on) {
        time--;
        clock.innerHTML = time;
        if (time == 0) {
            
            on = false;
            document.getElementById(i).style.pointerEvents = "none";
            fonction2(); // passage a la prochaine question automatiquement
        }
    }
}


start.onclick = function () {
    fonction2();
    on = true;
    time = 10; // Renitialiser le timer a sa valeur initiale
    clock.innerHTML = time; // Mettre a jour l'affichage du timer
    clearInterval(timerId); // Clear n'importe quel intervalle existant
    timerId = setInterval(decrement, interval); // Demarrage de timer
    document.getElementById("btn").style.display = 'flex';
    start.style.display = 'none';
};

// faire disparaitre toutes les questions si on n'a pas encore clique pas start de quiz
for (var j = 1; j <= 6; j++) {
    let question = document.getElementById(j.toString());
    if (question) {
        question.style.display = "none";
    }
}


function fonction() {
    //les variables contenant les bonnes reponses
    var ans1 = document.getElementById("opt1");
    var ans2 = document.getElementById("opt2");
    var ans3 = document.getElementById("opt3");
    var ans4 = document.getElementById("opt4");
    var ans5 = document.getElementById("opt5");
    var ans6=document.getElementById("opt6");

    //stocker les bonnes reponses dans un tableau
    let answers = [ans1.textContent, ans2.textContent, ans3.textContent,ans4.textContent,ans5.textContent,ans6.textContent];

    document.querySelectorAll(".opt").forEach(function (div) {
        div.onclick = function () {
            //annuler de choisir une nouvelle reponse
            document.getElementById(i).style.pointerEvents = "none";
            this.onclick = null;
            //incrementation du score si la reponse est correcte
            if (answers.includes(this.textContent)) {
                counter += 1;
                //si la reponse au correct, on la colorie en vert
                score.textContent = counter;
                this.style.backgroundColor = '#A8E6CF';
                //si la reponse est incorrecte on la colorie en rouge
            } else {
                this.style.backgroundColor = '#FF9191';
            }
        };
    });
}

// Move to the next question
function fonction2() {
    on = true;
    time = 10; // Renitialiser le timer a sa valeur initiale
    clock.innerHTML = time; // Mettre a jour l'affichage du timer
    clearInterval(timerId); // Clear n'importe quel intervalle existanr
    timerId = setInterval(decrement, interval); // Demarrage d'un nouveau timer

    let quest_encours = document.getElementById(i.toString());
    let proch_quest = document.getElementById((i + 1).toString());
    //disparaitre la question si deja repondu
    if (quest_encours) {
        quest_encours.style.display = "none";
    }
    //affichage de la prochaine question
    if (proch_quest) {
        proch_quest.style.display = "flex";
        proch_quest.style.justifyContent = 'center';
        proch_quest.style.alignItems = 'center';
        i++;
        fonction();
    } else {
        // la fin du quiz
        document.getElementById("btn").style.display = 'none';
        clock.innerHTML = "<b>Quiz Over!</b>";
        document.getElementById("titre").remove();
        document.getElementById("score").remove();
        div_res.style.display='flex';
        //affichage du score
        res.innerHTML=counter.toString()+"/6";
        per.innerHTML=(((parseFloat(counter/6)*100)).toFixed(2)).toString()+"%";
    }
}
