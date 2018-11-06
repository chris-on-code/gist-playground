import React, { useState } from 'react';
import Editor from './Editor';
import Terminal from './Terminal';
import './App.scss';

const Divitis = ({ children }) => (
  <div className="hero">
    <div className="hero-body">
      <div className="container">{children}</div>
    </div>
  </div>
);

export default function() {
  const [history, setHistory] = useState([]);

  const addItem = item => {
    history.push(item);
    setHistory(history);
  };

  const clearHistory = () => setHistory([]);

  return (
    <Divitis>
      <div className="playground">
        <div className="columns is-variable is-2">
          <div className="column playground-column">
            <Editor sandboxId="1234" addItem={addItem} />
          </div>
          <div className="column playground-column">
            <Terminal history={history} clearHistory={clearHistory} />
          </div>
        </div>
      </div>
    </Divitis>
  );
}
