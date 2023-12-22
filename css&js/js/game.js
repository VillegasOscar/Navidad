
//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);


} else {
    document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var playerPosX = 42;
var playerPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaMoneda = 2;
var tiempoMonedaMin = 0.3;
var tiempoMonedaMax = 1.8;
var monedaMinY = 5;
var monedaMaxY = 320;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var player;
var textoScore;
var suelo;
var gameOver;
var audioMoneda;
var audioSalto;
var audioGameOver;
var audioGeneral;
var audioWin;
var audioJump;

const audioSources = ["sound/music.mp3", "sound/music1.mp3"];



function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    player = document.querySelector(".player");
    audioGeneral = document.querySelector(".audio-general");
    audioMoneda = document.querySelector(".audio-moneda");
    audioSalto = document.querySelector(".audio-salto");
    audioGameOver = document.querySelector(".audio-gameOver");
    audioWin = document.querySelector(".audio-win");
    audioJump = document.querySelector(".audio-jump");
    document.addEventListener("touchstart", HandleKeyDown);
}

function Update() {
    if (parado) return;

    MoverPlayer();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearMonedas();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();
    audioGeneral.play();

    velY -= gravedad * deltaTime;
}
function playAudio() {
    let audioSource = audioSources[Math.floor(Math.random() * audioSources.length)];
    audioGeneral.src = audioSource;
};

function HandleKeyDown(ev) {
    Saltar();
}

function Saltar() {
    if (playerPosY === sueloY) {
        saltando = true;
        velY = impulso;
        player.classList.remove("player-corriendo");
        audioJump.play();
    }

}

function MoverPlayer() {
    playerPosY += velY * deltaTime;
    if (playerPosY < sueloY) {

        TocarSuelo();
    }
    player.style.bottom = playerPosY + "px";
}

function TocarSuelo() {
    playerPosY = sueloY;
    velY = 0;
    if (saltando) {
        player.classList.add("player-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    player.classList.remove("player-corriendo");
    player.classList.add("player-estrellado");
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}
function DecidirCrearMonedas() {
    tiempoHastaMoneda -= deltaTime;
    if (tiempoHastaMoneda <= 0) {
        CrearMoneda();
    }
}

function CrearMoneda() {
    var moneda = document.createElement("div");
    contenedor.appendChild(moneda);
    moneda.classList.add("moneda");
    moneda.posX = contenedor.clientWidth;
    moneda.style.left = contenedor.clientWidth + "px";
    moneda.style.bottom = monedaMinY + (monedaMaxY - monedaMinY) * Math.random() + "px";

    obstaculos.push(moneda);
    tiempoHastaMoneda = tiempoMonedaMin + Math.random() * (tiempoMonedaMax - tiempoMonedaMin) / gameVel;
}


function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("arbol");
    if (Math.random() > 0.5) obstaculo.classList.add("arboles");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    audioMoneda.currentTime = 0;
    audioMoneda.play();
    if (score == 3) {
        gameVel = 1.2;
        contenedor.classList.add("mediodia");
    } else if (score == 10) {
        gameVel = 1.5;
        contenedor.classList.add("tarde");
    } else if (score == 15) {
        gameVel = 1.8;
        contenedor.classList.add("noche");
    } else if (score == 24) {
        win()

    }
    suelo.style.animationDuration = (3 / gameVel) + "s";
}

function win() {
    Estrellarse();
    gameOver.style.display = "block";
    audioWin.play();
}
function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
    audioGameOver.play();
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > playerPosX + player.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        } else {
            if (IsCollision(player, obstaculos[i], 10, 30, 15, 20)) {
                if (obstaculos[i].classList.contains("moneda")) {
                    GanarPuntos();
                    obstaculos[i].parentNode.removeChild(obstaculos[i]);
                    obstaculos.splice(i, 1);
                } else {
                    GameOver();
                }
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}
