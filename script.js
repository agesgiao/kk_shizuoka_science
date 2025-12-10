document.addEventListener("DOMContentLoaded", () => {


  const voiceMap = {};
  for (let i = 1; i <= 12; i++) {
    voiceMap[`voice${i}`] = document.getElementById(`voice${i}`);
  }


  const videoMap = {};
  for (let i = 1; i <= 11; i++) {
    videoMap[`kk${i}`] = document.getElementById(`kk${i}`);
  }
  videoMap.kk61 = document.getElementById("kk61");
  videoMap.kk62 = document.getElementById("kk62");


  const overlaySuccess = document.getElementById("overlay-success");
  const overlayFail = document.getElementById("overlay-fail");
  const overlayVideoSuccess = document.getElementById("overlay-video-success");
  const overlayVideoFail = document.getElementById("overlay-video-fail");
  const countdownEl = document.getElementById("countdown");

  let challengeStarted = false;
  let endingTriggered = false;
  let countdownInterval, timeoutId;


  const voiceQueue = [];
  let currentVoice = null;
  const playedVoices = new Set();

function enqueueVoice(id) {
  if (voiceQueue.includes(id) || playedVoices.has(id)) return; // 既に再生済みなら無視
  voiceQueue.push(id);
  tryPlayNextVoice();
}

function tryPlayNextVoice() {
  if (currentVoice || voiceQueue.length === 0) return;

  const nextId = voiceQueue.shift();
  const next = voiceMap[nextId];
  if (!next) return tryPlayNextVoice();

  currentVoice = next;
  currentVoice.currentTime = 0;
  currentVoice.play().catch(e => console.warn("Audio blocked:", e));

  currentVoice.onended = () => {
    playedVoices.add(nextId); // 再生済みに追加
    currentVoice = null;

    // voice12 の場合だけ再生終了後にカウントダウン
    if (nextId === "voice12") startCountdown();

    tryPlayNextVoice();
  };
}




function resetMedia() {
  Object.values(videoMap).forEach(v => {
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  });
  Object.values(voiceMap).forEach(a => {
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
  });
}


  function resetOverlay() {
    overlaySuccess.style.display = "none";
    overlayFail.style.display = "none";
    overlayVideoSuccess.pause();
    overlayVideoSuccess.currentTime = 0;
    overlayVideoFail.pause();
    overlayVideoFail.currentTime = 0;
  }

  function resetAll() {
    resetMedia();
    resetOverlay();
    countdownEl.style.display = "none";
    clearTimeout(timeoutId);
    clearInterval(countdownInterval);
    challengeStarted = false;
    endingTriggered = false;
    voiceQueue.length = 0;
    currentVoice = null;
    playedVoices.clear();
  }


  function startCountdown() {
    if (challengeStarted) return;

    challengeStarted = true;
    let count = 30;
    countdownEl.textContent = count;
    countdownEl.style.display = "block";

    countdownInterval = setInterval(() => {
      count--;
      countdownEl.textContent = count;

      if (count <= 0) {
        clearInterval(countdownInterval);
        countdownEl.style.display = "none";
      }
    }, 1000);

    // タイムアウト（失敗）
    timeoutId = setTimeout(() => {
      if (!endingTriggered) {
        overlayFail.style.display = "flex";

        overlayVideoFail.play();
        videoMap.kk61.play();  // ← mp4 の音声で OK

        endingTriggered = true;
        challengeStarted = false;
      }
    }, 30000);
  }

  overlayVideoSuccess.onended = () => { overlaySuccess.style.display = "none"; };
  overlayVideoFail.onended = () => { overlayFail.style.display = "none"; };



  for (let i = 1; i <= 13; i++) {
    const el = document.getElementById(`target${i}`);

    el.addEventListener("targetFound", () => {

      // チャレンジ中は target1 以外は無視
      if (challengeStarted && i !== 1 && !endingTriggered) return;

      switch (i) {

        /* ---------- target1：成功 or スタート音声 ---------- */
        case 1:
          if (challengeStarted && !endingTriggered) {

            clearTimeout(timeoutId);
            clearInterval(countdownInterval);
            countdownEl.style.display = "none";

            overlaySuccess.style.display = "flex";
            overlayVideoSuccess.play();
            videoMap.kk62.play();  // ← mp4 の音声で OK

            endingTriggered = true;
            challengeStarted = false;

          } else if (!challengeStarted) {
            enqueueVoice("voice1");
          }
          break;

        /* ---------- target2〜11 ---------- */
        case 2: videoMap.kk2.play(); enqueueVoice("voice2"); break;
        case 3: videoMap.kk3.play(); enqueueVoice("voice3"); break;
        case 4: videoMap.kk4.play(); enqueueVoice("voice4"); break;
        case 5: videoMap.kk5.play(); enqueueVoice("voice5"); break;
        case 6: videoMap.kk6.play(); enqueueVoice("voice6"); break;
        case 7: videoMap.kk7.play(); enqueueVoice("voice7"); break;
        case 8: videoMap.kk8.play(); enqueueVoice("voice8"); break;
        case 9: videoMap.kk9.play(); enqueueVoice("voice9"); break;
        case 10: videoMap.kk10.play(); enqueueVoice("voice10"); break;
        case 11: videoMap.kk11.play(); enqueueVoice("voice11"); break;
		case 12:enqueueVoice("voice12");　break;


        /* ---------- target13：リロード ---------- */
        case 13:
          location.reload();
          break;
      }
    });
  }

  resetAll();
});









