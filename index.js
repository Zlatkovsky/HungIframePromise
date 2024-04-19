(() => {
  monkeypatchConsole();

  const iframeParentDiv = document.getElementById("iframe-parent");
  let iframe = addIframe();

  document.getElementById("invoke-iframe-function").onclick = async () => {
    console.clear();

    if (!iframe) {
      console.error("Iframe has already been removed. Please reload this page and try again.");
      return;
    }

    try {
      console.log("Host App: Starting call to iframe function, this will take 2 seconds");
      await iframe.contentWindow.longRunningIframeFunction();
      console.log("Host App: Finished call to iframe function");
    } catch (e) {
      console.error(`Host App: Caught error when executing iframe function. Error was: "${e}"`);
    }
    console.log("Host App: invokeSomethingOnIframe is done");
  };

  document.getElementById("remove-iframe").onclick = () => {
    iframeParentDiv.innerText = "";
    iframe = null;
  };

  function addIframe() {
    const iframe = document.createElement("iframe");
    iframe.src = "./iframe.html";
    iframe.addEventListener("load", function () {
      Array.from(document.getElementsByClassName("button")).forEach((button) => (button.disabled = ""));
    });
    iframeParentDiv.appendChild(iframe);
    return iframe;
  }

  function monkeypatchConsole() {
    const logElement = document.getElementById("log");

    const originalClearFunction = console.clear;
    const originalLogFunction = console.log;
    const originalErrorFunction = console.error;

    console.clear = function () {
      logElement.innerText = "";
      originalClearFunction();
    };

    console.log = function (log) {
      addEntry(log);
      originalLogFunction(arguments);
    };

    console.error = function (error) {
      addEntry(error);
      originalErrorFunction(arguments);
    };

    function addEntry(text) {
      const pre = document.createElement("pre");
      pre.innerText = text;
      logElement.appendChild(pre);
    }
  }
})();

// cspell:ignore monkeypatch
