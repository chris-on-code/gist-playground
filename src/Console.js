import React from 'react';
import './Terminal.scss';

export default ({ history, clearHistory }) => (
  <div className="playground-terminal">
    <ul>
      {history.map((item, index) => (
        <li key={index} className="terminal-line">
          <span className="terminal-carrot">></span>{' '}
          <span className="terminal-text">{item.text}</span>
        </li>
      ))}
      <li>
        <span className="terminal-carrot">></span>
      </li>
    </ul>

    <button
      onClick={clearHistory}
      className="button is-white is-outlined is-small"
    >
      Clear
    </button>
  </div>
);
