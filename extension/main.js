document.addEventListener('DOMContentLoaded', function () {
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
