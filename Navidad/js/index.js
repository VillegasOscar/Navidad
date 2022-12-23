const treeContainer = document.createElement("pre");
const mainContainer = document.querySelector(".main-container");
const nieve = document.querySelector(".nieve");
const audioSources = ["sound/navidad.mp3", "sound/navidad2.mp3", "sound/navidad3.mp3"];
const audioSources2 = ["sound/1.mp3", "sound/2.mp3", "sound/3.mp3", "sound/4.mp3", "sound/5.mp3", "sound/6.mp3", "sound/7.mp3", "sound/8.mp3", "sound/9.mp3"];
const player = document.getElementById("player");
let animacion = document.querySelectorAll(".main-container");
const heart = document.querySelector(".heart");
const animationHeart = document.querySelector(".animation-heart");

document.getElementById('player').style.display = 'none';
document.getElementById('bg').style.display = 'none';
player.addEventListener('ended', playAudio);
// player2.addEventListener('ended', playAudio2); faltando 1h


window.addEventListener('load', animar);


//Crea arbol
const createTree = (size) => {
    for (let i = 0; i < size; i++) {
        const spanElement = document.createElement("span");
        const branch = i === 0 || i === size - 1 ? "*\n" : `${"*".repeat(i * 2)}\n`;
        spanElement.textContent = branch;
        treeContainer.appendChild(spanElement);
    }
    mainContainer.appendChild(treeContainer);
};
createTree(15);
//Obten número random
const getRandomValue = (max, min = 1) => {
    return Math.floor(Math.random() * max) + min;
};

//Crea bola de nieve
const createSnow = (density) => {
    for (let i = 0; i < density; i++) {
        const snowFlake = document.createElement("span");
        const horizontalPosition = `${getRandomValue(100)}%`;
        const fallDelay = `${getRandomValue(100)}s`;
        const fallDuration = `${getRandomValue(20, 5)}s`;
        const flakeSize = `${getRandomValue(7, 1)}px`;
        const flakeOpacity = Math.random().toFixed(2);

        snowFlake.classList.add("snow");
        snowFlake.style.opacity = flakeOpacity;
        snowFlake.style.width = flakeSize;
        snowFlake.style.height = flakeSize;
        snowFlake.style.animation = `fall ${fallDuration} ${fallDelay} linear infinite`;
        snowFlake.style.right = horizontalPosition;

        mainContainer.appendChild(snowFlake);
    }
};

//Crea bola de nieve
const createSnow2 = (density) => {
    for (let i = 0; i < density; i++) {
        const snowFlake = document.createElement("span");
        const horizontalPosition = `${getRandomValue(100)}%`;
        const fallDelay = `${getRandomValue(100)}s`;
        const fallDuration = `${getRandomValue(20, 5)}s`;
        const flakeSize = `${getRandomValue(7, 1)}px`;
        const flakeOpacity = Math.random().toFixed(2);

        snowFlake.classList.add("snow");
        snowFlake.style.opacity = flakeOpacity;
        snowFlake.style.width = flakeSize;
        snowFlake.style.height = flakeSize;
        snowFlake.style.animation = `fall ${fallDuration} ${fallDelay} linear infinite`;
        snowFlake.style.right = horizontalPosition;

        nieve.appendChild(snowFlake);
    }
};
//createSnow2(300); //Faltando 3 horas

//Pone colores al arbol
function animar() {
    for (var i = 0; i < animacion.length; i++) {
        let tiempo = i / 20 + 1
        animacion[i].style.animation = "colores " + tiempo + "s infinite"
    }
}

//Reproduce una lista de audios
function playAudio() {
    let audioSource = audioSources[Math.floor(Math.random() * audioSources.length)];
    player.src = audioSource;
};

//Reproduce una lista de audios
function playAudio2() {
    let audioSource = audioSources2[Math.floor(Math.random() * audioSources2.length)];
    player2.src = audioSource;
};

// document.getElementById('player').style.display = 'block';
// playAudio2();  faltando 1 hora

//API de cuenta regresiva
simplyCountdown('#cuenta', {
    year: 2022, // required
    month: 12, // required
    day: 24, // required 24
    hours: 18, // Default is 0 [0-23] integer 18
    minutes: 52, // Default is 0 [0-59] integer
    seconds: 0, // Default is 0 [0-59] integer
    words: { //words displayed into the countdown
        days: 'Día',
        hours: 'Hora',
        minutes: 'Minuto',
        seconds: 'Segundo',
        pluralLetter: 's'
    },
    plural: true, //use plurals
    inline: false, //set to true to get an inline basic countdown like : 24 days, 4 hours, 2 minutes, 5 seconds
    inlineClass: 'simply-countdown-inline', //inline css span class in case of inline = true
    // in case of inline set to false
    enableUtc: true, //Use UTC as default
    onEnd: function () {
        document.getElementById('portada').classList.add('oculta');
        document.getElementById('player').style.display = 'block';
        document.getElementById('bg').style.display = 'block';
        createSnow(300);
        playAudio();
        return;
    }, //Callback on countdown end, put your own function here
    refresh: 1000, // default refresh every 1s
    sectionClass: 'simply-section', //section css class
    amountClass: 'simply-amount', // amount css class
    wordClass: 'simply-word', // word css class
    zeroPad: false,
    countUp: false
});

//Animacion de corazón
heart.addEventListener('click', () => {
    animationHeart.classList.add('animation');
    heart.classList.add('fill-color');
    setTimeout(function () {
        animationHeart.classList.remove('animation')
        heart.classList.remove('fill-color')
    }, 500);
})

animationHeart.addEventListener('click', () => {
    animationHeart.classList.remove('animation')
    heart.classList.remove('fill-color')
})

//Canvas del botón
$(document).ready(function () {
    new AnimateBG("canvasBG", "http://sd.uploads.im/t/z7xY4.png").start();
});

