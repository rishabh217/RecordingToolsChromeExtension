var contextMenus = {};

contextMenus.copyUrl =
    chrome.contextMenus.create(
        { "title": "Copy URL" },
        function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            }
        }
    );

chrome.contextMenus.onClicked.addListener(contextMenusHandler);

function contextMenusHandler(info, tab) {
    if (info.menuItemId === contextMenus.copyUrl) {
        urlCopy();
    }
}

function urlCopy() {
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

}