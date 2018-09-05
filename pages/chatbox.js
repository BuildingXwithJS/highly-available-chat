import React from 'react';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

// Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
const {
  publicRuntimeConfig: {domain},
} = getConfig();

export default class IndexPage extends React.Component {
  state = {messages: [], text: ''};

  static async getInitialProps({query}) {
    const {username} = query;
    const id = await fetch(`${domain}/id`).then(r => r.text());
    return {username, id};
  }

  constructor(props) {
    super(props);

    if (process.browser) {
      this.setupWebsocket();
    }
  }

  setupWebsocket = () => {
    const host = window.location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(host);
    ws.onmessage = msg => this.setState(s => ({messages: s.messages.concat(JSON.parse(msg.data))}));
    this.ws = ws;
  };

  handleInput = e => {
    this.setState({text: e.target.value});
  };

  sendMessage = () => {
    const {text} = this.state;
    const {username} = this.props;
    const newMessage = {
      text,
      username,
      time: Date.now(),
    };

    this.ws.send(JSON.stringify(newMessage));
    this.setState({text: ''});
  };

  render() {
    return (
      <div>
        <h1>Hi {this.props.username}!</h1>
        <h3>Your server ID is: {this.props.id}</h3>

        <div>
          {this.state.messages.map(message => (
            <div key={message.time}>
              [{new Date(message.time).toLocaleString()}] {message.username}: {message.text}
            </div>
          ))}
        </div>

        <input type="text" value={this.state.text} onChange={this.handleInput} />
        <button onClick={this.sendMessage}>Send message!</button>
      </div>
    );
  }
}
