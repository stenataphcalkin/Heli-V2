import { useEffect } from "react";

export default function Story() {
  const useScript = (url) => {
    useEffect(() => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "module";
      script.crossOrigin = "use-credentials";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }, [url]);
  };
  useScript("/ink-files/ink.js");
  useScript("/ink-files/main.js");
  return (
    <>
      <div id="controls" className="buttons">
        <button id="rewind" title="Restart story from beginning">
          restart
        </button>
        <button id="save" title="Save progress">
          save
        </button>
        <button id="reload" title="Reload from save point">
          load
        </button>
      </div>
      <div id="story" className="container"></div>
    </>
  );
}
