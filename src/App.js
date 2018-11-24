import React, { useState } from 'react';
import Editor from './Editor';
import Browser from './Browser';
import Console from './Console';
import './App.scss';

const Divitis = ({ children }) => (
  <div className="hero">
    <div className="hero-body">
      <div className="container">{children}</div>
    </div>
  </div>
);

export default () => {
  const [history, setHistory] = useState([]);
  const [js, setJs] = useState('');
  const [css, setCss] = useState('');
  const [html, setHtml] = useState('');

  const addHistory = text => {
    history.push({ text });
    setHistory(history);
  };

  const clearHistory = () => setHistory([]);

  const runCode = ({ html, css, js }) => {
    setJs('');
    setCss('');
    setHtml('');

    setTimeout(() => {
      setJs(js);
      setCss(css);
      setHtml(html);
    }, 150);
  };

  return (
    <Divitis>
      <div className="playground">
        <h2 className="title is-4 has-text-centered">Basic Demo</h2>
        <div className="columns is-variable is-2">
          <div className="column playground-column">
            <Editor
              sandboxId="1234"
              addHistory={addHistory}
              runCode={runCode}
            />
          </div>
          <div className="column playground-column">
            <Browser html={html} css={css} js={js} addHistory={addHistory} />
            <Console history={history} clearHistory={clearHistory} />
          </div>
        </div>
      </div>
    </Divitis>
  );
};
