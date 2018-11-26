import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neat.css';
import './Editor.scss';
require('codemirror/mode/css/css');
require('codemirror/mode/javascript/javascript');

export default class Editor extends Component {
  state = { value: this.props.code };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.code !== this.props.code)
      this.setState({ value: this.props.code });
  }

  handleChange = (editor, data, value) => {
    this.setState({ value });
    this.debouncedUpdate(value);
  };

  debouncedUpdate = debounce(value => {
    this.props.updateCode(value);
  }, 500);

  render() {
    const { value } = this.state;
    const { language } = this.props;
    const options = { lineNumbers: true, mode: language, theme: 'neat' };

    return (
      <div className="playground-editor">
        <CodeMirror
          value={value}
          onBeforeChange={this.handleChange}
          options={options}
        />
      </div>
    );
  }
}
