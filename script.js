const circle = document.getElementById("circle");
const main = document.querySelector("main");
const resultArea = document.getElementById("resultArea");
const memo = document.getElementById("memo");
const countdown = document.getElementById("countdown");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const restartButton = document.getElementById("restartButton");
const exportButton = document.getElementById("exportButton");

// ===== 設定 =====
const sessionDuration = 30000; // 30秒
const period = 3000; // 1往復4秒
const margin = 10; // 左右の余白

// ===== 管理変数 =====
let startTime = null;
let animationId = null;
let running = false;

// ===== 円の位置を計算 =====
function getPosition(elapsed) {
  const amplitude = Math.max(
    0,
    (main.clientWidth - circle.offsetWidth) / 2 - margin,
  );

  return amplitude * Math.sin((2 * Math.PI * elapsed) / period);
}


/**
 * 初期画面に戻す
 */
function resetSession() {

  // アニメーションが動作中なら停止
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // セッションの実行状態を初期化
  running = false;
  startTime = null;

  // 円を非表示にして中央へ戻す
  circle.hidden = true;
  circle.style.transform =
    "translate(-50%, -50%)";

  // 問いかけ・入力画面を非表示
  resultArea.hidden = true;

  // 最初のスタートボタンを表示
  startButton.hidden = false;

  // 停止ボタン・再開ボタンを非表示
  stopButton.hidden = true;
  restartButton.hidden = true;

  // カウントダウンを非表示
  countdown.hidden = true;
  countdown.textContent = "残り 30 秒";
}

// ===== セッション終了 =====
function finishSession() {
  if (!running) return;

  running = false;

  // アニメーション停止
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // 円を消す
  circle.hidden = true;

  // 入力画面を表示
  resultArea.hidden = false;

  // ボタンを切り替え
  stopButton.hidden = true;
  restartButton.hidden = false;

  // カウントダウン
  countdown.textContent = "残り 0 秒";
}

// ===== アニメーション =====
function animate(timestamp) {
  if (!running) return;

  if (startTime === null) {
    startTime = timestamp;
  }

  const elapsed = timestamp - startTime;

  // 30秒経過
  if (elapsed >= sessionDuration) {
    finishSession();
    return;
  }

  // カウントダウン
  const remaining = Math.ceil((sessionDuration - elapsed) / 1000);

  countdown.textContent = `残り ${remaining} 秒`;

  // 円の位置計算
  const x = getPosition(elapsed);

  circle.style.transform = `translate(calc(-50% + ${x}px), -50%)`;

  animationId = requestAnimationFrame(animate);
}

// ===== セッション開始 =====
function startSession() {
  // 前のアニメーションを停止
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  startTime = null;
  running = true;

  // スタートボタンを消す
  startButton.hidden = true;

  // 円を表示
  circle.hidden = false;

  // 円の位置を中央に戻す
  circle.style.transform = "translate(-50%, -50%)";

  // 入力画面を消す
  resultArea.hidden = true;

  // 停止ボタンを表示
  stopButton.hidden = false;

  // 再開ボタンを消す
  restartButton.hidden = true;

  // カウントダウンを表示
  countdown.hidden = false;
  countdown.textContent = "残り 30 秒";

  // アニメーション開始
  animationId = requestAnimationFrame(animate);
}

// ===== TXTファイル名生成 =====
function createFileName() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${dd}${hh}${mm}${ss}.txt`;
}

// ===== TXT出力 =====
function exportText() {
  const text = memo.value;

  if (text.trim() === "") {
    alert("テキストを入力してください。");
    return;
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = createFileName();

  document.body.appendChild(a);

  a.click();
  a.remove();

  // 一時URLを解放
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
}

// ===== イベント設定 =====

// 初期画面のスタート
startButton.addEventListener("click", startSession);

// 停止ボタン
stopButton.addEventListener("click", finishSession);

// 再開ボタン
restartButton.addEventListener("click", resetSession);

// TXT出力ボタン
exportButton.addEventListener("click", exportText);

// 初回は自動開始しない
