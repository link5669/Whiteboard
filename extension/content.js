
// opens a communication port
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (o) {
    if (!o.setListeners)
      chrome.scripting.executeScript({
        target: { tabId: o.start },
        files: ['buttonListeners.js'],
      });
  })
  // listen for every message passing throw it
  port.onMessage.addListener(function (o) {
    // if the message comes from the popup
    if (o.from && o.from === 'updateQuestionBtn' && o.start) {
      chrome.scripting.executeScript({
        target: { tabId: o.start },
        files: ['getData.js'],
      });
    }
  });
  port.onMessage.addListener(function (o) {
    // if the message comes from the popup
    if (o.from && o.from === 'starGameBtn' && o.start) {
      chrome.scripting.executeScript({
        target: { tabId: o.start },
        files: ['resetGame.js'],
      });
    }
  });
});