import React, { useEffect, useState } from "react";
import "./App.css";
import debug from "debug";
import { CgSpinner } from "react-icons/cg";

const log = debug("BrowserVerifier");

const SOLC_BIN_URL = "https://binaries.soliditylang.org/bin";

const CompilerWorker = new Worker(new URL("./browserCompilerWorker", import.meta.url));

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState(""); // State to store the file name
  const [error, setError] = useState("");
  const [compilerReleases, setCompilerReleases] = useState({});
  const [selectedCompiler, setSelectedCompiler] = useState("");
  const [compilerMessage, setCompilerMessage] = useState("");
  const [compilerError, setCompilerError] = useState("");
  const [isLoadingCompiler, setIsLoadingCompiler] = useState(false);

  CompilerWorker.onmessage = (e) => {
    log("Message received from worker");
    log(e.data);
    if (e.data.type === "compilerLoaded") {
      setCompilerMessage("Compiler loaded successfully");
      setCompilerError("");
      setIsLoadingCompiler(false);
    }
  };

  useEffect(() => {
    fetch(`${SOLC_BIN_URL}/list.json`)
      .then((res) => res.json())
      .then((res) => {
        setCompilerReleases(res.releases); // only releases and not nightlies
      });
  }, []);

  const loadCompiler = async (compilerFileName) => {
    const compilerUrl = `${SOLC_BIN_URL}/${compilerFileName}`;
    setIsLoadingCompiler(true);
    log(`Loading compiler from ${compilerUrl}`);
    CompilerWorker.postMessage({ type: "loadCompiler", url: compilerUrl });
  };

  const handleCompilerSelect = async (e) => {
    setSelectedCompiler(e.target.value);
    if (e.target.value) {
      log(`Compiler selected: ${e.target.value}`);
      loadCompiler(e.target.value);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name in state
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setJsonData(json); // Save the parsed JSON into state
          setError(""); // Clear any previous error
        } catch (err) {
          setError("Invalid JSON file. Please check the syntax and try again.");
          setJsonData(null); // Reset the state
          setFileName(""); // Clear the file name
        }
      };
      reader.onerror = (e) => {
        setError("Error reading the file");
        setFileName(""); // Clear the file name on read error
      };
    }
  };

  return (
    <div className="App p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Playground to test the Solidity compiler in Browser</h1>
        {/* Dropdown to choose the compiler */}
        <div className="mb-8">
          <h2 className="text-xl mb-2">Compiler</h2>
          <div className="flex items-center">
            <select
              id="compilerSelect"
              className="max-w-72 cursor-pointer bg-gray-100 mt-1 pl-3 pr-10 py-2 text-base sm:text-sm rounded-md"
              value={selectedCompiler}
              onChange={handleCompilerSelect}
            >
              <option value="">Choose compiler version</option>
              {Object.entries(compilerReleases).map(([version, url]) => (
                <option key={url} value={url}>
                  {version}
                </option>
              ))}
            </select>
            {isLoadingCompiler && (
              <div className="flex items-center ml-2">
                <CgSpinner className="animate-spin text-2xl" />
                <span className="ml-2">Loading Compiler</span>
              </div>
            )}
          </div>
          {compilerMessage && <div className="text-green-500">{compilerMessage}</div>}
          {compilerError && <div className="text-red-500">{compilerError}</div>}
        </div>

        {/* Input file */}
        <div>
          <h2 className="text-xl mb-2">Input</h2>
          <p className="mb-2">Add a Solidity Input JSON file here</p>
          <p className="text-xs text-gray-500 mb-2">Only files with .json extension are supported</p>
          <div className="mb-4">
            <input
              type="file"
              id="input"
              accept=".json"
              onChange={handleFileChange}
              className="block text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {jsonData && (
            <div>
              <div className="text-green-500">JSON file loaded successfully!</div>
              <h2 className="mt-4">{fileName}</h2>
              <pre className="bg-gray-200 font-mono text-sm p-4 overflow-auto">{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
