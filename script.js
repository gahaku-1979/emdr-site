const circle = document.getElementById("circle");
const main = document.querySelector("main");
const message = document.getElementById("message");
const countdown = document.getElementById("countdown");
const restartButton = document.getElementById("restartButton");

// ===== 設定 =====
const sessionDuration = 30000; // 1セッション30秒
const period = 3000; // 円の1往復4秒
const margin = 10; // 左右端の余白

// ===== 管理変数 =====
let startTime = null;
let animationId = null;

// ===== 円の位置を計算 =====
function getPosition(elapsed) {
  const amplitude = Math.max(
    0,
    (main.clientWidth - circle.offsetWidth) / 2 - margin,
  );

  const x = amplitude * Math.sin((2 * Math.PI * elapsed) / period);

  return x;
}

// ===== セッション終了処理 =====
function finishSession() {
  // 円を消す
  circle.style.display = "none";

  // 中央にメッセージを表示する
  message.hidden = false;

  // 再開ボタンを表示
  restartButton.hidden = false;

  // カウントダウンを0にする
  countdown.textContent = "残り 0 秒";

  // アニメーションを終了する
  animationId = null;
}

// ===== アニメーション処理 =====
function animate(timestamp) {
  if (startTime === null) {
    startTime = timestamp;
  }

  const elapsed = timestamp - startTime;

  // 30秒経過したら終了
  if (elapsed >= sessionDuration) {
    finishSession();
    return;
  }

  // 残り時間を表示
  const remaining = Math.ceil((sessionDuration - elapsed) / 1000);

  countdown.textContent = `残り ${remaining} 秒`;

  // 円の位置を取得
  const x = getPosition(elapsed);

  // 円を左右へ移動
  circle.style.transform = `translate(calc(-50% + ${x}px), -50%)`;

  // 次のフレームを描画
  animationId = requestAnimationFrame(animate);
}

// ===== セッション開始処理 =====
function startSession() {
  // 前のアニメーションがあれば停止
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  // 開始時刻を初期化
  startTime = null;

  // 円を再表示
  circle.style.display = "block";

  // 再開ボタンを非表示
  restartButton.hidden = true;

  // 円を中央に戻す
  circle.style.transform = "translate(-50%, -50%)";

  // メッセージを非表示
  message.hidden = true;

  // カウントダウンを初期化
  countdown.textContent = "残り 30 秒";

  // アニメーション開始
  animationId = requestAnimationFrame(animate);
}

// ===== 再開ボタン =====
restartButton.addEventListener("click", startSession);

// ページ表示時に自動開始
startSession();
