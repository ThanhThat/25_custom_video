const $ = document.querySelector.bind(document);

const playPause = $(".play-pause");
const videoNode = document.getElementById("video");
const progressBar = $(".progress");
const progressRange = $(".progress-range");
const volBtn = $(".btn-vol");
const volProgress = $(".vol-progress");
const volRange = $(".vol-range");

let isPressed = false;
let isPressedVol = false;
let vol = 0.8;

videoNode.volume = vol;
volRange.style.width = vol * 100 + "%";
videoNode.onloadedmetadata = function () {
  let durationVideo = setTime(videoNode.duration);

  $(".time2").textContent = formatTime(durationVideo);

  $(".btn-full-screen").addEventListener("click", toggleFullScreen);

  // set state video pause/play

  volProgress.addEventListener("mousedown", function (e) {
    e.preventDefault();
    isPressedVol = true;
    handleVolProgress(e);
  });
  document.addEventListener("mouseup", function (e) {
    e.preventDefault();
    isPressedVol = false;
  });
  volProgress.addEventListener("mousemove", function (e) {
    e.preventDefault();
    if (isPressedVol) {
      handleVolProgress(e);
    }
  });

  videoNode.addEventListener("click", function () {
    if (this.dataset.state === "play") {
      playVideo();
    } else if (this.dataset.state === "pause") {
      pauseVideo();
    }
  });

  progressBar.addEventListener("mousedown", function (e) {
    e.preventDefault();
    isPressed = true;
    const percent = (e.offsetX / this.offsetWidth) * 100;
    progressRange.style.width = percent + "%";
    videoNode.currentTime = videoNode.duration * (percent / 100);
  });
  document.addEventListener("mouseup", function (e) {
    e.preventDefault();
    isPressed = false;
  });
  progressBar.addEventListener("mousemove", function (e) {
    e.preventDefault();
    if (isPressed) {
      const percent = (e.offsetX / this.offsetWidth) * 100;
      progressRange.style.width = percent + "%";
      videoNode.currentTime = videoNode.duration * (percent / 100);
    }
  });

  // click play/pause
  playPause.addEventListener("click", function () {
    if (this.dataset.state === "play") {
      playVideo();
    } else if (this.dataset.state === "pause") {
      pauseVideo();
    }
  });

  videoNode.addEventListener("timeupdate", setWidthProgressRange);
};

// set progress duration time
function handleSetDuration(e) {}

// function set vol range
function handleVolProgress(e) {
  vol = e.offsetX;

  if (vol > 100) {
    vol = 100;
  }
  if (vol < 0) {
    vol = 0;
  }
  videoNode.volume = vol / 100;
  volRange.style.width = vol + "%";
}

// toggle full screen
function toggleFullScreen() {
  if (videoNode.requestFullScreen) {
    videoNode.requestFullScreen();
  } else if (videoNode.webkitRequestFullScreen) {
    videoNode.webkitRequestFullScreen();
  } else if (videoNode.mozRequestFullScreen) {
    videoNode.mozRequestFullScreen();
  }
}

function setTime(time) {
  let hour = Math.trunc(time / 3600);
  let min = Math.trunc((time / 3600 - hour) * 60);
  let sec = Math.trunc(((time / 3600 - hour) * 60 - min) * 60);

  return {
    hour,
    min,
    sec,
  };
}

function formatTime(time) {
  let h = time.hour < 10 ? "0" + time.hour + ":" : time.hour;
  let m = time.min < 10 ? "0" + time.min + ":" : time.min;
  let s = time.sec < 10 ? "0" + time.sec : time.sec;

  if (h === "00:") {
    h = "";
  }
  if (m === "00:" && h === "") {
    m = "";
  }

  let result = `${h}${m}${s}`;

  return result;
}

function setState() {
  if (this.ended === true || this.paused) {
    this.dataset.state = "play";
    playPause.dataset.state = "play";
    playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
  } else if (!this.paused) {
    playPause.dataset.state = "pause";
    videoNode.dataset.state = "pause";
    playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
}

function setWidthProgressRange() {
  const percent = (videoNode.currentTime / videoNode.duration) * 100;
  progressRange.style.width = percent + "%";

  setState.call(this);

  let currTime = setTime(videoNode.currentTime);

  $(".time1").textContent = formatTime(currTime);
}

function playVideo() {
  videoNode.play();
  setState.call(videoNode);
}

function pauseVideo() {
  videoNode.pause();
  setState.call(videoNode);
}
