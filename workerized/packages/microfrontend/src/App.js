import React, { useEffect, useState, Component } from 'react';
import logo from './logo.svg';
import './App.css';

window.addEventListener('something', (data) => {
  console.log({ data });
})

class App extends Component {
  state = {
    messages: []
  };

  componentDidMount() { 
    window.worky.addEventListener('message', (message) => {
      if (message.data.type) {
        return;
      }

      const newMessages = this.state.messages.concat(message.data);

      this.setState({ messages: newMessages });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.messages.map((something, i) => <p key={something + i}>{something}</p>)}
        </header>
      </div>
    );
  }
}

export default App;
