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

async function recordScreen() {
    const mimeType = 'video/webm';
    shouldStop = false;
    const constraints = {
        video: {
            cursor: 'motion'
        }
    };
    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
        return window.alert('Screen Record not supported!')
    }
    let stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "motion" }, audio: { 'echoCancellation': true } });
    if (window.confirm("Record audio with screen?")) {
        const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: { 'echoCancellation': true }, video: false });
        let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()]
        stream = new MediaStream(tracks);
        handleRecord({ stream, mimeType })
    } else {
        stream = displayStream;
        handleRecord({ stream, mimeType });
    };
    videoElement.srcObject = stream;
}

startButton.addEventListener('click', function () {
    recordScreen();
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