let shouldStop = false;
let stopped = false;

const videoElement = document.getElementsByTagName("video")[0];
const downloadLink = document.querySelector('.fa-download');
const stopButton = document.querySelector('.fa-stop');
const startButton = document.querySelector('.fa-play');

function startRecord() {
    startButton.disabled = true;
    startButton.style.color = "#00a15377";
    stopButton.disabled = false;
    stopButton.style.color = "#ba000d";
    downloadLink.disabled = false;
    downloadLink.style.display = "none";
}
function stopRecord() {
    startButton.disabled = false;
    startButton.style.color = "#00a152";
    stopButton.disabled = true;
    stopButton.style.color = "#ba000c73";
    downloadLink.disabled = true;
    downloadLink.style.display = "block";
}
function initiate() {
    startButton.disabled = false;
    startButton.style.color = "#00a152";
    stopButton.disabled = true;
    stopButton.style.color = "#ba000c73";
    downloadLink.disabled = false;
    downloadLink.style.display = "none";
}

stopButton.addEventListener('click', function () {
    shouldStop = true;
    stopButton.style.animation = "buttonAnimation 0.5s 1";
    setTimeout(() => {
        stopButton.style.animation = "none";
    }, 1000);
});

const handleRecord = function ({ stream, mimeType }) {
    startRecord()
    let recordedChunks = [];
    stopped = false;
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }

        if (shouldStop === true && stopped === false) {
            mediaRecorder.stop();
            stopped = true;
        }
    };

    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, {
            type: mimeType
        });
        recordedChunks = []
        const filename = window.prompt('Enter file name');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${filename || 'recording'}.webm`;
        stopRecord();
        videoElement.srcObject = null;
    };

    mediaRecorder.start(200);
};

async function recordVideo() {
    const mimeType = 'video/webm';
    shouldStop = false;
    const constraints = {
        audio: {
            "echoCancellation": true
        },
        video: {
            "width": {
                "min": 640,
                "max": 1024
            },
            "height": {
                "min": 480,
                "max": 768
            }
        }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    handleRecord({ stream, mimeType })
}

startButton.addEventListener('click', function () {
    recordVideo();
    startButton.style.animation = "buttonAnimation 0.5s 1";
    setTimeout(() => {
        startButton.style.animation = "none";
    }, 1000);
})

downloadLink.addEventListener('click', function () {
    downloadLink.style.animation = "buttonAnimation 0.5s 1";
    setTimeout(() => {
        downloadLink.style.animation = "none";
    }, 1000);
})

initiate();