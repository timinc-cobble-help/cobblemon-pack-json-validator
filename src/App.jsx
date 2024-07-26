import { useState } from "react";
import Page from "./components/structure/Page";
import "./style.scss";
import { useEffect } from "react";
import { validateJsonsInZip } from "./util";

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResults(null);
  };

  useEffect(() => {
    let running = true
    validateJsonsInZip(file)
      .then((res) => {
        if (!running) return
        setResults(res.sort((a, b) => a.valid - b.valid))
      })
    return () => {
      running = false
    }
  }, [file])

  return <Page name="Cobblemon Pack JSON Validator">
    {
      !results
        ? <>
          <h2>Gimme yer pack</h2>
          <input type="file" accept=".zip" onChange={handleFileChange} />
        </>
        : <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <h2>Here&apos;s your results</h2>
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
