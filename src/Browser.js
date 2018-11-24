import React, { useEffect, useRef } from 'react';

export default ({ sandboxId, html, css, js, addHistory }) => {
  const iframeContainer = useRef(null);

  useEffect(() => {
    window.addEventListener('message', e => {
      if (!e.data) return false;
      if (typeof e.data !== 'string') return false;
      if (e.data.includes('_')) return false;
      addHistory(e.data);
    });
  }, []);

  useEffect(() => execute(), [html, css, js]);

  const execute = () => {
    // remove all children
    while (iframeContainer.current.hasChildNodes()) {
      iframeContainer.current.removeChild(iframeContainer.current.lastChild);
    }

    // create new iframe
    let iframe = document.createElement('iframe');
    iframe.height = '100%';
    iframe.width = '100%';
    iframe.sandbox = 'allow-scripts';
    iframe.style.border = 'none';

    // convert all console.log to use scotchLog
    const newJs = js.replace(new RegExp('console.log', 'g'), 'scotchLog');

    try {
      iframe.srcdoc = `
<html>
<head>
  <style>${css}</style>
</head>
<body>
${html}

<script>
  function scotchLog() {
    let output = "", arg, i;

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      output += typeof arg === "object" ? JSON.stringify(arg) : arg;
    }

    window.parent.postMessage(output, '*');
    console.log(...arguments);
  }

  // -----------------------------------------

  ${newJs}
</script>
</body>
</html>      
`;
    } catch (e) {
      console.error(e);
    }

    // insert it into dom
    iframeContainer.current.appendChild(iframe);
  };

  return (
    <div
      ref={iframeContainer}
      className="iframe-container"
      style={{
        height: '100%',
        width: '100%',
        background: 'white'
      }}
    />
  );
};
