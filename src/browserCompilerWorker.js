/* eslint-disable no-restricted-globals */ // "self" is a global variable for workers
import wrapper from "solc/wrapper";
import debug from "debug";
const log = debug("browserCompilerWorker");
log.enabled = !process.env.NODE_ENV || process.env.NODE_ENV !== "production";

let compiler;

self.onmessage = (e) => {
  log(`Received message from main thread: ${e.data.type}`);
  switch (e.data.type) {
    case "loadCompiler": {
      const data = e.data;
      log("Loading compiler from ", data.url);
      self.importScripts(data.url);
      log("importScripts done");
      compiler = wrapper(self.Module);
      log("Compiler loaded");

      self.postMessage({ type: "compilerLoaded", version: compiler.version() });
      break;
    }
    case "compile": {
      if (!compiler) {
        console.error("Compiler not loaded");
        return;
      }
      const data = e.data;
      log("Compiling: ", data.text);
      const result = compiler.compile(data.text);
      log("Compilation result: ", result);
      self.postMessage({ type: "compilationResult", result });
      break;
    }
    default: {
      console.error("Unknown message type: ", e.data.type);
    }
  }
};
