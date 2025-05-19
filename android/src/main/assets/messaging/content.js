/* eslint-disable no-eval */
console.log(`content:start`);
let ReactNativeWebView = {
  postMessage: function (message) {
    browser.runtime.sendMessage({
      action: "ReactNativeWebView",
      data: message,
    });
  },
};
// eslint-disable-next-line no-undef
window.wrappedJSObject.ReactNativeWebView = cloneInto(
  ReactNativeWebView,
  window,
  {
    cloneFunctions: true,
  }
);

function injectScript(content) {
  const script = document.createElement("script");
  script.textContent = content;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

browser.runtime.onMessage.addListener((data, sender) => {
  if (data.inject) {
    try {
      injectScript(data.inject);
    } catch (e) {
      console.warn("Script injection failed:", e);
    }
    return Promise.resolve();
  } else {
    let event;
    try {
      // eslint-disable-next-line no-undef
      event = new MessageEvent("message", data);
    } catch (e) {
      event = document.createEvent("MessageEvent");
      event.initMessageEvent(
        "message",
        true,
        true,
        data.data,
        data.origin,
        data.lastEventId,
        data.source
      );
    }
    document.dispatchEvent(event);
  }
});
