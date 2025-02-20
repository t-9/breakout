// Canvasの取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ボールのプロパティ
let ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  dx: 5,
  dy: -5
};

// パドルのプロパティ
let paddle = {
  height: 10,
  width: 75,
  x: (canvas.width - 75) / 2,
  dx: 7,
  rightPressed: false,
  leftPressed: false
};

// ブロックのプロパティ
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// スコア
let score = 0;

// ゲームオーバーフラグ
let gameOver = false;

// ゲームクリアフラグ
let gameClear = false;

// キーボードイベント
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.leftPressed = false;
  }
}

// 衝突検知
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
          ball.dy = -ball.dy;
          b.status = 0;
          score++;
        }
      }
    }
  }
}

// ボールの描画
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// パドルの描画
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// ブロックの描画
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// スコアの描画
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20);
}

// ゲームの描画と更新
function draw() {
  // 画面をクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 描画処理
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();

  // ボールの移動
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 壁との衝突
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    }
  }

  // ボールが画面下に落ちたらゲームオーバー
  if (ball.y - ball.radius * 2 > canvas.height) {
    gameOver = true;
    alert('ゲームオーバー');
    document.location.reload();
  }

  // パドルの移動
  if (paddle.rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.dx;
  } else if (paddle.leftPressed && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }

  // 衝突検知
  collisionDetection();

  // ゲームクリアのチェック
  if (score === brickRowCount * brickColumnCount && !gameClear) {
    gameClear = true;
  }

  // ゲームが終了していなければ次のフレームをリクエスト
  if (!gameOver && !gameClear) {
    requestAnimationFrame(draw);
  } else if (gameClear) {
    // 最後の描画を確実に行ってからゲームクリアを表示
    requestAnimationFrame(() => {
      draw();
      setTimeout(() => {
        alert('ゲームクリア！');
        document.location.reload();
      }, 50);
    });
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ゲーム開始
draw();