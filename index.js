const $canvas = document.getElementById("myCanvas");
const ctx = $canvas.getContext("2d");
let ballRadius = 10;
let x = $canvas.width/2;
let y = $canvas.height-30;
let dx = 3;
let dy = -3;
let paddleHeight = 10;
let paddleWidth = 100;
let paddleX = ($canvas.width-paddleWidth)/2;
let sidePoint = 20;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 4;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 35;
let brickPadding = 10;
let brickOffsetTop = 50;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(let r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 2 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if(e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if(e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if(e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - $canvas.offsetLeft;
  if(relativeX > 0 && relativeX < $canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function collisionDetection() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
        let b = bricks[c][r];
        if(b.status === 2) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 1;
          score++;
          }
        }  
        else if(b.status === 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          // if(score === brickRowCount*brickColumnCount*2) {
          //   afterClear();
          //   alert("YOU WIN, CONGRATULATIONS!");
          //   alert("大吉！");
            // document.location.reload();
            // clearInterval(interval); // Needed for Chrome to end game
          // }        
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Lives: "+lives, $canvas.width-65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, $canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(paddleX+sidePoint, $canvas.height-paddleHeight);
  ctx.lineTo(paddleX+sidePoint, $canvas.height);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(paddleX+paddleWidth-sidePoint, $canvas.height-paddleHeight);
  ctx.lineTo(paddleX+paddleWidth-sidePoint, $canvas.height);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status === 2) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0062aa";
        ctx.fill();
        ctx.closePath();
      }
      else if(b.status === 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095dd";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawImage() {
  const img1 = new Image();
  img1.src = "images/white.png";
  img1.onload = () => {
    ctx.drawImage(img1, 0, 0);
  }
  const img2 = new Image();
  img2.src = "images/2310066.jpg";
  img2.onload = () => {
    ctx.drawImage(img2, 74, 0, 333, 248);
  }
}

function draw() {
  // ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  drawImage();
  drawBall();
  drawBricks();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if(x + dx > $canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > $canvas.height-ballRadius) {
    if(paddleX-ballRadius <= x && x < paddleX+sidePoint) {
      dy = -dy;
      dx = -dx;
    }
    else if(paddleX+sidePoint <= x && x <= paddleX+(paddleWidth-sidePoint)) {
      dy = -dy;
    }
    else if(paddleX+(paddleWidth-sidePoint) < x && x <= paddleX+paddleWidth+ballRadius) {
      dy = -dy;
      dx = -dx;
    } 
    else {
      lives--;
      if(!lives) {
        alert("GAME OVER");
      document.location.reload();
      clearInterval(interval); // Needed for Chrome to end game （setInterval使ってないのに無いと止まらない）
      } else if(lives === 2) {
        x = $canvas.width/2;
        y = $canvas.height-30;
        dx = 4;
        dy = -4;
        paddleX = ($canvas.width-paddleWidth)-2;
      } else {
        x = $canvas.width/2;
        y = $canvas.height-30;
        dx = 5;
        dy = -5;
        paddleX = ($canvas.width-paddleWidth)-2;
      }
    }
  }

  if(rightPressed && paddleX < $canvas.width-sidePoint) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX+(paddleWidth-sidePoint) > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  // ↓テスト用
  // score = brickRowCount*brickColumnCount*2

  // if(score < brickRowCount*brickColumnCount*2) {
  //   requestAnimationFrame(draw);
  // }
}

function drawClearMessage() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("クリア！", 210, 280);
}

function drawOmikujiButton() {
  ctx.beginPath();
  ctx.rect(165, 270, 150, 50);
  ctx.fillStyle = "#cc0000";
  ctx.fill();
  ctx.closePath();
  ctx.font = "20px serif";
  ctx.fillStyle = "#fff";
  ctx.fillText("おみくじを引く", 171, 302);
}

function omikujiStart() {
  ctx.clearRect(0, 260, $canvas.width, $canvas.height-260);
  const img1 = new Image();
  img1.src = "images/white.png";
  img1.onload = () => {
  ctx.drawImage(img1, 0, 260, $canvas.width, $canvas.height-260);
  omikujiResult();
  }
}

function omikujiResult() {
  let rand = Math.floor( Math.random() * 100) ; //おみくじの目の生成
  if(rand <= 24) {
    ctx.font = "25px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("大吉", 210, 280);
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("今年の運勢は極めていいでしょう。", 90, 320);
    ctx.fillText("多くの願いごとも叶います。", 90, 350);
    ctx.fillText("積極的に行動しましょう。", 90, 380);
  }
	if(24 < rand && rand <= 49) {
    ctx.font = "25px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("吉", 223, 280);
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("何事にも日頃の行いがよければ、", 90, 320);
    ctx.fillText("うまくいくでしょう。", 90, 350);
    ctx.fillText("新しく試したこともうまくいきます。", 90, 380);
  }
	if(49 < rand && rand <= 74) {
    ctx.font = "25px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("中吉", 210, 280);
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("焦りは禁物、コツコツことを為すことで", 60, 320);
    ctx.fillText("思いがけない幸が訪れるでしょう。", 60, 350);
  }
	if(74 < rand && rand <= 99) {
    ctx.font = "25px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("小吉", 210, 280);
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#402717";
    ctx.fillText("自分の思っていることが", 90, 312);
    ctx.fillText("うまくいかない時もあるでしょう。", 90, 342);
    ctx.fillText("努力と丹念続けていけば、", 90, 372);
    ctx.fillText("どこかで実をむすぶでしょう。", 90, 402);
  }
}

afterClearIndex = 0;

function afterClear() {
  if(afterClearIndex < 1) {
    drawOmikujiButton();
  }

  $canvas.addEventListener("click", e => {
    const rec = {
    x: 165, y: 270,  // 座標
    w: 150, h: 50   // サイズ
    };
  
    // マウスの座標をCanvas内の座標とあわせるため
    const rect = $canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  
    // クリック判定処理
    const hit =
        (rec.x <= point.x && point.x <= rec.x + rec.w)  // 横方向の判定
     && (rec.y <= point.y && point.y <= rec.y + rec.h)  // 縦方向の判定
  
    if (afterClearIndex < 1 && hit) {
      afterClearIndex += 1;
      omikujiStart();
    }
  });
}

function blockBrake() {
  if(score < brickRowCount*brickColumnCount*2) {
    draw();
  }
  if(score === brickRowCount*brickColumnCount*2) {
    afterClear();
  }
  requestAnimationFrame(blockBrake);
}

document.getElementById("startButton").onclick = () => {
  blockBrake();
}

document.getElementById("reloadButton").onclick = () => {
  document.location.reload();
  clearInterval(interval); // Needed for Chrome to end game
}