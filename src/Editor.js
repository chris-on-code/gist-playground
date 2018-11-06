import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import './Editor.scss';
require('codemirror/mode/javascript/javascript');

export default class Editor extends Component {
  state = {
    code: `// 1. create a string
const myMessage = 'this is so ugly';

// 2. replace ugly with beautiful
const newMessage = myMessage.replace('ugly', 'beautiful');

// 3. outputs: this is so beautiful
console.log(newMessage);
    `
  };

  componentDidMount() {
    window.scotchLog = this.scotchLog.bind(this);
    this.evaluateCode();
  }

  handleChange = code => {
    this.setState({ code });
    this.debouncedEval(code);
  };

  evaluateCode = () => {
    const newCode = this.state.code.replace(
      new RegExp('console.log', 'g'),
      `scotchLog`
    );

    try {
      eval(newCode);
    } catch (err) {
      console.error(err);
      this.scotchLog(err.message);
    }
  };

  debouncedEval = debounce(this.evaluateCode, 2000);

  scotchLog() {
    let output = '';
    let arg;
    let i;

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      output += typeof arg === 'object' ? JSON.stringify(arg) : arg;
    }

    this.props.addItem({ text: output });
  }

  render() {
    const { code } = this.state;
    const options = {
      lineNumbers: true
    };

    return (
      <div className="playground-editor">
        <CodeMirror
          value={code}
          onChange={this.handleChange}
          options={options}
        />

        <button onClick={this.evaluateCode} className="button">
          Run
        </button>
      </div>
    );
  }
}
