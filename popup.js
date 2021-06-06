const screenBtn = document.querySelector('.fa-record-vinyl');
const videoBtn = document.querySelector('.fa-video');
const audioBtn = document.querySelector('.fa-microphone-alt');
const copyButton = document.querySelector('.fa-clipboard');

screenBtn.addEventListener('click', function () {
    chrome.tabs.create({ url: 'html/screen.html' });
});

videoBtn.addEventListener('click', function () {
    chrome.tabs.create({ url: 'html/video.html' });
});

audioBtn.addEventListener('click', function () {
    chrome.tabs.create({ url: 'html/audio.html' });
});

copyButton.addEventListener('click', function () {
    chrome.tabs.getSelected(null, function (tab) {
        console.log(tab.url)
        var copyTextarea = document.createElement('textarea');
        copyTextarea.value = tab.url;
        copyTextarea.focus();
        copyTextarea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            alert(`URL Copied : ${tab.url}`);
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        copyTextarea.remove();
    });
});