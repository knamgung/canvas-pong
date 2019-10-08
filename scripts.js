console.log("in scripts");

// Gets the canvas and sets it to a variable
// to manipulate and add elements through javascript

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let generate = 1;
let ballArr = [];
// location of the ball

// Array for the history data
let historyArr = [];

// Speed changers for the ball per hit
let speedX = 1;
let speedY = 1;

// Size changer for the ball per hit
let sizes = 1;

// Location of the paddle
let paddleX = canvas.width / 2;

// Toggles auto mode off and on
let autoMode = false;

// Initial speed of the ball
let dx = 1.75;
let dy = -2.25;

// Width of the paddle
let paddleWidth = 100;

// State if the splashscreen is active
let splashScreenOn = true;

// paddle height
let paddleHeight = 10;

// paddle move speed
let pX = 20;

// score
let score = 0;

// sets the state if the game is on or if its over
let gameOn = false;
let gameOver = false;

// splash screen message
let playGameMessage = "Press any key to Play";

// moves the paddle on the laptop (keyboard)
document.addEventListener("keydown", keyDownHandler, false);

// moves the paddle on the phone (touch)
document.getElementById("myCanvas").addEventListener("touchstart", touchFunc);

// creating new img and audio elememt and assigning them to a variable (like the canvas)
let img = new Image(); // Create new img element
let leftHit = new Audio("left.wav"); // left hit sound
let topHit = new Audio("top.wav"); // top hit sound
let rightHit = new Audio("right.wav"); // right hit sound
let lose = new Audio("lose.wav"); // lose hit sound

let hit = new Audio("hit.wav"); // paddle hit sound
img.src = "pong.png"; // Set source path
img.addEventListener("load", startGame);

// Function that moves the paddle based on the user touch
function touchFunc(event) {
  let x = event.touches[0].clientX - bound.left - canvas.clientLeft;

  // splits the screen in half, left for the paddle to go left and right to go right
  if (x > 150) {
    paddleX = paddleX + pX;
  } else {
    paddleX = paddleX - pX;
  }
}

// starts the draw loop
function startGame() {
  console.log("in startgame");
  myTimer = setInterval(gameLoop, 16);
}

// Splash screen design on the canvas
const splashScreen = word => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "100 14px sfPro";

  ctx.fillStyle = "white";
  ctx.fillText(playGameMessage, 30, canvas.height / 2.1);

  ctx.font = "30px sfPro";

  ctx.fillStyle = "#f5db4f";

  ctx.fillText(word, 30, canvas.height / 2.5);
};

// While checking the state of the game it calls the function needed based on the state
function gameLoop() {
  if (splashScreenOn) {
    splashScreen("pong.js");
  }
  if (gameOver) {
    endGame();
  }
  if (gameOn == true) {
    document.querySelector(".quant").style.display = "none";
    gameUpdate();
    gameDraw();
  }
  if (splashScreenOn == false && gameOn == false) {
    gameDraw();
  }
}

// the drawing function that loops recursively
function gameDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ballArr.forEach(ball => {
    ctx.drawImage(img, ball.x, ball.y, 25, 25);
  });

  ctx.fillStyle = "red";
  ctx.font = "16px sfPro";
  document.querySelector(".game__score--track").innerHTML = score;

  ctx.fillStyle = "#f5db4f";
  ctx.fillRect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
}

// Updates the game while the game is active
function gameUpdate() {
  for (let i = 0; i < ballArr.length; i++) {
    ballArr[i].x = ballArr[i].x - ballArr[i].dx;
    ballArr[i].y = ballArr[i].y + ballArr[i].dy;

    // conditions for automatic mode
    if (autoMode) {
      paddleX = ballArr[i].x - paddleWidth / 2;
    }

    if (ballArr[i].x > canvas.width || ballArr[i].x < 0) {
      ballArr[i].dx = -ballArr[i].dx;
      if (ballArr[i].x > canvas.width) {
        leftHit.play();
      } else {
        rightHit.play();
      }
    }

    if (ballArr[i].y < 0) {
      ballArr[i].dy = -ballArr[i].dy;
      topHit.play();
    }

    if (ballArr[i].y > canvas.height) {
      if (ballArr[i].x > paddleX && ballArr[i].x < paddleX + paddleWidth) {
        hit.play();
        score++;
        console.log("HITTING");
        ballArr[i].speedX += 0.005;
        ballArr[i].speedY += 0.015;
        sizes -= 0.005;
        ballArr[i].dx = ballArr[i].dx * ballArr[i].speedX;
        ballArr[i].dy = ballArr[i].dy * ballArr[i].speedY;
        paddleWidth = paddleWidth * sizes;
        ballArr[i].dy = -ballArr[i].dy;
        document.querySelector(".game__x").innerHTML = `Ball ${i + 1}`;
      } else {
        lose.play();
        playGameMessage = "Press any key to Play";
        gameOn = false;
        sizes = 1;
        ballArr = [];
        paddleWidth = 100;
        gameOver = true;
        document.querySelector(".quant").style.display = "flex";
      }
    }
  }
}

// the function that calls the event listener on the keyboard
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    paddleX = paddleX + pX;
  } else if (e.keyCode == 37) {
    paddleX = paddleX - pX;
  } else if (!gameOn) {
    score = 0;
    gameOver = false;
    playGameMessage = "";
    gameOn = true;
  }
}

// toggles the modal thats scene on start up
const openModal = e => {
  let modal = document.querySelector(".splash");

  if (modal.style.display == "none") {
    modal.style.display = "initial";
  } else {
    modal.style.display = "none";
  }
};

document.querySelector(".splash__exit").addEventListener("click", openModal);
document.querySelector(".game__modal").addEventListener("click", openModal);
document.querySelector(".game__auto").addEventListener("click", () => {
  autoMode = !autoMode;
});

// Function that recursively creates html string element to produce history cards
const renderHistory = () => {
  let newHistory = () => {
    let history = "";
    for (let i = 0; i < historyArr.length; i++) {
      history += `<div class="history__body">
      <h5 class="history__game">Game ${i + 1}</h5>
      <div class="history__result">
        <p class="history__sub">score</p>
        <h4 class="history__score">${historyArr[i].score}</h4>
              <div class="history__quant">
              <p class="history__quant--num">${historyArr[i].ball} Ball</p>
              </div>
      </div>
      

    </div>`;
    }

    return history;
  };

  if (historyArr.length > 0) {
    document.querySelector(".history__title").style.display = "initial";
  }

  document.querySelector(".history__each").innerHTML = newHistory();
};

// function that toggles when the state of the game is ended
const endGame = () => {
  let historyScore = { score: score, ball: generate };
  splashScreen("Game Over");
  historyArr.push(historyScore);
  renderHistory();
  gameOver = false;
};

// Event listeners for the touch and mouse controllers for the paddle
document
  .getElementById("myCanvas")
  .addEventListener("touchmove", touchMove, false);
document
  .getElementById("myCanvas")
  .addEventListener("mousemove", touchMove, false);

document
  .getElementById("myCanvas")
  .addEventListener("touchstart", touchStart, false);
document
  .getElementById("myCanvas")
  .addEventListener("mousedown", touchStart, false);

// function to control the paddle for the position of the mouse

function touchMove(event) {
  event.preventDefault();
  // let x = event.screenX || event.touches[0].clientX;
  let bound = canvas.getBoundingClientRect();

  let x = event.clientX - bound.left - canvas.clientLeft;
  let y = event.clientY - bound.top - canvas.clientTop;
  if (gameOn) {
    paddleX = x - 50;
  }
}

function generateAuto() {
  if (generate > 1) {
    document.querySelector(".game__auto").style.display = "none";
  } else {
    document.querySelector(".game__auto").style.display = "initial";
  }
}

// function to start the game by touch (mobile use)
function touchStart() {
  if ((splashScreenOn == true && gameOn == false) || gameOn == false) {
    splashScreenOn = true;
    // dx = 2;
    // dy = -2;
    // ballArr[i].x = canvas.width / 2;
    // ballArr[i].y = canvas.height / 2;

    score = 0;
    generateBalls(generate);
    generateAuto();
    gameOn = true;
    document.querySelector(".quant").style.display = "flex";
  }
}

function generateBalls(numb) {
  for (let i = 0; i < numb; i++) {
    if (i === 0) {
      var newBall = {
        x: Math.floor((Math.random() * canvas.width) / 2),
        y: Math.floor((Math.random() * canvas.height) / 2),
        speedX: 1,
        speedY: 1,
        dx: 1.75,
        dy: 1.8
      };
    } else {
      var newBall = {
        x: Math.floor((Math.random() * canvas.width) / 2),
        y: Math.floor((Math.random() * canvas.height) / 2),
        speedX: 1,
        speedY: 1,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 2 + 0.2
      };
    }

    ballArr.push(newBall);
  }
}

const ballChange = e => {
  generate = e.target.value;
};

document.querySelector(".quant__input").addEventListener("change", ballChange);
