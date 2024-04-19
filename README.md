# README

This simple repro demonstrates an unexpected "frozen-promise" behavior that occurs when code calls a long-running iframe function, and the iframe is destroyed before the function completes. See the live demo at <https://zlatkovsky.github.io/HungIframePromise/>

Our expectation is that if the "outside" window calls something on the iframe and gets a `Promise` returned, that `Promise` should either resolve or reject, but it shouldn't just hang indefinitely. If the iframe is destroyed and all code stops executing on the iframe -- which seems to be the case -- the `Promise` should reject with some sort of _"Execution context is destroyed"_ error.

**Host code:**

```javascript
try {
  console.log("Host App: Starting call to iframe function, this will take 2 seconds");
  await iframe.contentWindow.longRunningIframeFunction();
  console.log("Host App: Finished call to iframe function");
} catch (e) {
  console.error(`Host App: Caught error when executing iframe function. Error was: "${e}"`);
}
console.log("Host App: invokeSomethingOnIframe is done");
```

**Iframe code:**

```javascript
window.longRunningIframeFunction = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Iframe: finished waiting 2 seconds, returning the Promise");
      resolve();
    }, 2000);
  });
};
```

In our production-app case, the hanging Promise causes cleanup code -- which would otherwise run as soon as the Promise is resolved or rejected -- to not run. This, in turn, causes a massive memory leak.
