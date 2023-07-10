let audioContext;
let mediaStreamSource;
let analyser;
let canvas, canvasCtx;
let animationId;

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function(stream) {
      audioContext = new AudioContext();
      mediaStreamSource = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();

      mediaStreamSource.connect(analyser);
      analyser.connect(audioContext.destination);

      canvas = document.getElementById("waveformCanvas");
      canvasCtx = canvas.getContext("2d");

      animationId = requestAnimationFrame(draw);
    })
    .catch(function(err) {
      console.error("Error accessing microphone:", err);
    });
}

function stopRecording() {
  cancelAnimationFrame(animationId);
  mediaStreamSource.disconnect();
  analyser.disconnect();
  audioContext.close();
}

function draw() {
  const bufferLength = analyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";
  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();

  animationId = requestAnimationFrame(draw);
}

startRecording();
