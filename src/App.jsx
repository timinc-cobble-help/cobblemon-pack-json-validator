import { useCallback, useState } from "react";
import Page from "./components/structure/Page";
import "./style.scss";
import { useEffect } from "react";
import { validateJsonsInZip } from "./util";

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = useCallback((event) => {
    setFile(event.target.files[0]);
    setResults(null);
  }, []);

  useEffect(() => {
    let running = true
    validateJsonsInZip(file)
      .then((res) => {
        if (!running) return
        setResults(res?.sort((a, b) => a.valid - b.valid))
      })
    return () => {
      running = false
    }
  }, [file])

  const handleReset = useCallback(() => {
    setFile(null);
    setResults(null);
  }, [])

  return <Page name="Cobblemon Pack JSON Validator">
    {
      !results
        ? <>
          <h2>Gimme yer pack</h2>
          <p>Having troubles with your setup? Get told that an addon you&apos;ve installed is the most likely culprit? Run the addons you&apos;ve added to your modpack in here and it&apos;ll tell you if it&apos;s got an invalid JSON file inside of it.</p>
          <p>Don&apos;t worry, it doesn&apos;t actually upload the file to some server somewhere, it just reviews it using your browser.</p>
          <input type="file" accept=".zip" onChange={handleFileChange} />
        </>
        : <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "1rem" }}>
            <h2>Here&apos;s your results</h2>
            <button onClick={handleReset}>Reset</button>
          </div>
          <div className="overflow-auto" style={{ minHeight: 0, flexBasis: 0, flexGrow: 1 }}>
            {results.map((result) => (
              <details key={result.filename}>
                <summary role="button" className={result.valid ? "secondary" : "primary"}>{result.filename}</summary>
                <p>{result.error || "No issues here :)"}</p>
              </details>
            ))}
          </div>
        </div>
    }
  </Page>;
}

export default App;
