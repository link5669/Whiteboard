let setListeners = false
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        port.postMessage({
            'from': 'btnListeners',
            'start': activeTab.id,
            'setListeners': setListeners
        });
        setListeners = true
    });
    document.getElementById('starGameBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            port.postMessage({
                'from': 'starGameBtn',
                'start': activeTab.id
            });
        });
    })
    document.getElementById('updateQuestionBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            port.postMessage({
                'from': 'updateQuestionBtn',
                'start': activeTab.id
            });
        });
    })
    // opens a communication between scripts
    var port = chrome.runtime.connect();

});
