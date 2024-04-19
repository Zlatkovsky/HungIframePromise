(() => {
  monkeypatchConsole();

  window.longRunningIframeFunction = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Iframe: finished waiting 3 seconds, returning the Promise");
        resolve();
      }, 3000);
    });
  };

  function monkeypatchConsole() {
    const logElement = window.parent.document.getElementById("log");

    const originalLogFunction = console.log;
    const originalErrorFunction = console.error;

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
