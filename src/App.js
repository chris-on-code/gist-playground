import React, { Component } from 'react';
import Editor from './Editor';
import Browser from './Browser';
import Console from './Console';
import './App.scss';

/**
 * Separating to its own component cuz divitis
 */
const PlaygroundHeader = ({ title, runCode }) => (
  <div className="playground-header">
    <div className="columns">
      <div className="column">
        <h2 className="title is-6">{title}</h2>
      </div>
      <div className="column has-text-right">
        <button onClick={runCode}>Run</button>
      </div>
    </div>
  </div>
);

/**
 * The main playground component
 * Get a gist and only pull the first file of each .html, .css, .js
 */
export default class Playground extends Component {
  state = {
    history: [],
    title: '',
    html: '',
    css: '',
    js: '',
    isProcessing: false // tiny way to stop a user from hitting run 10000 times in a row
  };

  // helpers cuz lazy
  setTitle = title => this.setState({ title });
  setHistory = history => this.setState({ history });
  setHtml = html => this.setState({ html });
  setCss = css => this.setState({ css });
  setJs = js => this.setState({ js });

  /**
   * Grab the gist on first mount
   * mocking a gist id for now
   * https://gist.github.com/sevilayha/efe7fe257c9bfdc4d81aa654ddbb5bec
   */
  componentDidMount() {
    const gistId = this.props.gistId || 'efe7fe257c9bfdc4d81aa654ddbb5bec';
    this.getGist(gistId);
  }

  /**
   * Get the gist from GitHub API
   * Parse for the .html, .css, .js files
   * This is simple. Will only pull the first file in the gist of each extension
   */
  getGist = id => {
    fetch(`https://api.github.com/gists/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // find the first .html, .css, .js files and apply them as the content
        const fileNames = Object.keys(data.files);
        const gistHtml = fileNames.find(file => file.includes('.html'));
        const gistCss = fileNames.find(file => file.includes('.css'));
        const gistJs = fileNames.find(file => file.includes('.js'));

        this.setTitle(data.description);
        if (gistHtml) this.setHtml(data.files[gistHtml].content);
        if (gistCss) this.setCss(data.files[gistCss].content);
        if (gistJs) this.setJs(data.files[gistJs].content);
      });
  };

  addHistory = text => {
    const newHistory = [...this.state.history, { text }];
    this.setHistory(newHistory);
  };

  clearHistory = () => this.setHistory([]);

  /**
   * Since our browser only runs when code is changed, we set things to blank and then reset them
   * TODO: Probably a better way to do this than the setTimeout()
   */
  runCode = () => {
    if (this.state.isProcessing) return false;
    this.setState({ isProcessing: true });

    const { html, css, js } = this.state;
    this.setHtml('');
    this.setCss('');
    this.setJs('');

    setTimeout(() => {
      this.setHtml(html);
      this.setCss(css);
      this.setJs(js);
      this.setState({ isProcessing: false });
    }, 250);
  };

  render() {
    const { history, title, html, css, js } = this.state;
    const { playgroundId, gistId } = this.props;

    return (
      <div className="playground">
        <PlaygroundHeader title={title} runCode={this.runCode} />

        <div className="playground-content">
          {/* editors */}
          {/* TODO: add support for html and css */}
          {/* <Editor language="html" code={html} updateCode={this.setHtml} />
              <Editor language="css" code={css} updateCode={this.setCss} /> */}
          <Editor language="javascript" code={js} updateCode={this.setJs} />

          {/* browser will run all of our code in an iframe */}
          <Browser
            playgroundId={playgroundId}
            html={html}
            css={css}
            js={js}
            addHistory={this.addHistory}
          />

          {/* console only shows the output of history */}
          <Console history={history} clearHistory={this.clearHistory} />
        </div>
      </div>
    );
  }
}
