import React from 'react';
import Router from 'next/router';

export default class IndexPage extends React.Component {
  state = {username: ''};

  handleUsername = e => {
    this.setState({username: e.target.value});
  };

  navigateToChat = () => {
    const {username} = this.state;
    Router.push({
      pathname: '/chatbox',
      query: {username},
    });
  };

  render() {
    return (
      <div>
        <h1>Welcome to chat!</h1>
        <div>Enter your username:</div>
        <input type="text" value={this.state.username} onChange={this.handleUsername} />
        <button onClick={this.navigateToChat}>Start talking!</button>
      </div>
    );
  }
}
