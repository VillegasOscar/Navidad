<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style-game.css" />
    <title>Game</title>
    <style>
        .snow {
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            top: -100px;
        }

        * {
            padding: 0;
            margin: 0;
        }

        body {
            height: 100vh;
            background: #584040;
            display: flex;
            align-items: center;
        }

        .contenedor {
            width: 920px;
            height: 280px;
            margin: 0 auto;

            position: relative;

            background: linear-gradient(#b7d6c7, transparent) #ffe2d1;
            /*linear-gradient(#90ebff, white);*/
            transition: background-color 1s linear;
            overflow: hidden;
        }

        .mediodia {
            background-color: white;
        }

        .tarde {
            background-color: #ff9b44;
        }

        .noche {
            background-color: #3831198e;
        }

        .player {
            width: 84px;
            height: 84px;

            position: absolute;
            bottom: 22px;
            left: 42px;
            z-index: 2;

            background: url(img/run.png) repeat-x 0px 0px;
            background-size: 336px 84px;
            background-position-x: 0px;

        }

        .moneda {
            width: 48px;
            height: 48px;
            position: absolute;
            z-index: 1;

            background: url(img/moneda.png) no-repeat center center;
        }

        .player-corriendo {
            animation: animarPlayer 0.25s steps(2) infinite;
        }

        .player-estrellado {
            background-position-x: -252px;
        }

        .suelo {
            width: 200%;
            height: 42px;

            position: absolute;
            bottom: 0;
            left: 0;

            background: url(img/suelo.jpg) repeat-x 0px 0px;
            background-size: 50% 42px;

        }

        .arbol {
            width: 46px;
            height: 96px;

            position: absolute;
            bottom: 16px;
            left: 600px;
            z-index: 1;

            background: url(img/arbol.png) no-repeat;
        }

        .arboles {
            width: 98px;
            height: 66px;

            background: url(img/arboles.png) no-repeat;
        }

        .nube {
            width: 92px;
            height: 26px;

            position: absolute;
            z-index: 0;

            background: url(img/nube.png) no-repeat;
            background-size: 92px 26px;
        }

        .score {
            width: 100px;
            height: 30px;

            position: absolute;
            top: 5px;
            right: 15px;
            z-index: 10;

            color: #ff0000;
            font-family: Verdana;
            font-size: 30px;
            font-weight: bold;
            text-align: right;
        }

        .game-over {
            display: none;

            position: absolute;
            width: 100%;


            text-align: center;
            color: #ff0000;
            font-size: 30px;
            font-family: Verdana;
            font-weight: 700;
        }

        .game-win {
            display: none;

            position: absolute;
            width: 100%;


            text-align: center;
            color: #00ff0d;
            font-size: 30px;
            font-family: Verdana;
            font-weight: 700;
        }

        @keyframes animarPlayer {
            from {
                background-position-x: -84px;
            }

            to {
                background-position-x: -450px;
            }
        }
    </style>
</head>

<body>
    <div class="contenedor">
        <div class="suelo"></div>
        <div class="player player-corriendo"></div>
        <div class="score">0</div>
        <main class="main-container"></main>
    </div>

    <div class="game-over" onclick="recargarPagina()">¡Gracias por jugar! Presiona aquí para seguir jugando.</div>

    <div class="game-win" onclick="home()">¡Gracias por jugar! Presiona aquí para volver al inicio.</div>

    <audio src="sound/music.mp3" class="audio-general"autoplay></audio>
    <audio src="sound/coin.mp3" class="audio-moneda"></audio>
    <audio src="sound/gameOver.mp3" class="audio-gameOver"></audio>
    <audio src="sound/win.mp3" class="audio-win"></audio>
    <audio src="sound/jump.mp3" class="audio-jump"></audio>
    <!-- https://www.zapsplat.com/sound-effect-category/multimedia-->

    <script>

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
        var gameWin
        var audioMoneda;
        var audioSalto;
        var audioGameOver;
        var audioGeneral;
        var audioWin;
        var audioJump;

        const audioSources = ["sound/music.mp3", "sound/music1.mp3"];



        function Start() {
            gameOver = document.querySelector(".game-over");
            gameWin = document.querySelector(".game-win")
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

        function recargarPagina() {
            location.reload();
        }
        function home() {
            window.location.href = 'index.php';
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
            if (score == 13) {
                //gameVel = 1.2;
                contenedor.classList.add("mediodia");
            } else if (score == 26) {
                gameVel = 1.2;
                contenedor.classList.add("tarde");
            } else if (score == 39) {
                gameVel = 1.4;
                contenedor.classList.add("noche");
            } else if (score == 50) {
                win()

            }
            suelo.style.animationDuration = (3 / gameVel) + "s";
        }

        function win() {
            Estrellarse();
            gameWin.style.display = "block";
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

    </script>
</body>

</html>