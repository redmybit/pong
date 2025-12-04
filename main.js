const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");

const fps = 30;
const interval = 1000 / fps;

const padding = 50;

const paddleWidth = 100;
const paddleHeight = 15;

const paddleSpeed = 5;

let aiX = canvas.width / 2;
let aiY = padding;

let paddleX = canvas.width / 2;
let paddleY = canvas.height - padding;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

const ballSize = 20;

let velX = 0;
let velY = 0;

let ballSpeed = 10;
const speedOnBounce = 2;
const maxSpeed = 22;

const keys = {};

let state = "pending";

function newGame() {
	aiX = canvas.width / 2;
	aiY = padding;

	paddleX = canvas.width / 2;
	paddleY = canvas.height - padding;
	
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	
	let r = Math.random();
	velX = r;
	velY = 1 - r;
	
	ballSpeed = 10;
}

function hitBall(t) {
	if(t === "wall") {
		velX *= -1;
	} else if (t === "paddle") {
		velY *= -1;
		
		ballSpeed += speedOnBounce;
		if(ballSpeed > maxSpeed) {
			ballSpeed = maxSpeed;
		}
	}
}

function aiLogic() {
	if(aiX < ballX + velX * ballSpeed) {
		aiX += paddleSpeed;
		aiX = clipPaddle(aiX);
	} else {
		aiX -= paddleSpeed;
		aiX = clipPaddle(aiX);
	}
}

function movementLogic() {
	if(keys["a"]) {
		paddleX -= paddleSpeed;
		paddleX = clipPaddle(paddleX);
	} else if (keys["d"]) {
		paddleX += paddleSpeed;
		paddleX = clipPaddle(paddleX);
	}
}

function gameLogic() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "white";
	ctx.fillRect(paddleX - paddleWidth / 2, canvas.height - padding, paddleWidth, paddleHeight); // player
	ctx.fillRect(aiX - paddleWidth / 2, padding, paddleWidth, paddleHeight); // ai
	
	if(ballSpeed >= 14) {
		ctx.fillStyle = "yellow";
		if(ballSpeed >= 18) {
			ctx.fillStyle = "orange";
			if(ballSpeed >= 22) {
				ctx.fillStyle = "red";
			}
		}
		
	}
	
	ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
	
	// ctx.fillStyle = "blue";
	// ctx.fillRect(paddleX, paddleY, 5, 5);
	
	if(state === "playing") {
		movementLogic();
		
		ballX += velX * ballSpeed;
		ballY += velY * ballSpeed;
		
		if(Math.abs(ballY - (canvas.height - padding)) <= paddleHeight) {
			if(Math.abs(ballX - paddleX) <= paddleWidth / 2) {
				ballY = canvas.height - padding - ballSize / 2 - paddleHeight / 2;
				hitBall("paddle");
			}
		} else if (Math.abs(ballY - ballSize / 2 - padding) <= paddleHeight) {
			if(Math.abs(ballX - aiX) <= paddleWidth / 2) {
				ballY = padding + ballSize / 2 + paddleHeight / 2;
				hitBall("paddle");
			}
		}
		
		if(ballY < 0 || ballY > canvas.height) {
			state = "pending";
		}
		
		if(ballX - ballSize / 2 < 0 || ballX + ballSize / 2 > canvas.width) {
			hitBall("wall");
		}
		
		aiLogic();
		
	} else if (state === "pending") {
		newGame();
		state = "playing";
	}
}

function clipPaddle(x) {
	let nx = x;

	if(nx + paddleWidth / 2 > canvas.width) {
		nx = canvas.width - paddleWidth / 2;
	} else if(nx - paddleWidth / 2 < 0) {
		nx = paddleWidth / 2;
	}
	
	return nx
}

document.addEventListener('keydown', (event) => {
	keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
	keys[event.key] = false;
});

newGame();
setInterval(gameLogic, interval);