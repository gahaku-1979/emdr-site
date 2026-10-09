
const circle = document.getElementById("circle");
const main = document.querySelector("main");
const toggleButton = document.getElementById("toggleButton");

// 設定値
const duration = 10000; // 1往復にかかる時間（ミリ秒）
const margin = 30;      // 画面端からの余白（px）

let running = true;
let elapsed = 0;
let previousTime = null;

// 円を動かす関数
function animate(timestamp) {

  if (previousTime === null) {
    previousTime = timestamp;
  }

  if (running) {
    elapsed += timestamp - previousTime;

    // 円の移動可能距離
    const amplitude = Math.max(
      0,
      (main.clientWidth - circle.offsetWidth) / 2 - margin
    );

    // 左右の往復位置を計算
    const x = amplitude * Math.sin(
      (2 * Math.PI * elapsed) / duration
    );

    // 円の位置を更新
    circle.style.transform =
      `translate(calc(-50% + ${x}px), -50%)`;
  }

  previousTime = timestamp;
  requestAnimationFrame(animate);
}

// 一時停止・再開
toggleButton.addEventListener("click", () => {
  running = !running;

  toggleButton.textContent =
    running ? "一時停止" : "再開";
});

// アニメーション開始
requestAnimationFrame(animate);
