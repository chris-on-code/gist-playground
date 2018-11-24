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
    this.evaluateCode();
  }

  handleChange = code => {
    this.setState({ code });
    this.debouncedRun(code);
  };

  evaluateCode = () => {
    this.props.runCode({ js: this.state.code });
  };

  debouncedRun = debounce(this.evaluateCode, 500);

  render() {
    const { code } = this.state;
    const options = { lineNumbers: true };

    return (
      <div className="playground-editor">
        <CodeMirror
          value={code}
          onChange={this.handleChange}
          options={options}
        />

        <button
          onClick={this.evaluateCode}
          className="button is-dark is-outlined is-small"
        >
          Run
        </button>
      </div>
    );
  }
}
