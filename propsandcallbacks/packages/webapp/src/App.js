/* eslint-disable */
import { withMicrofrontend } from 'react-microfrontend';

import React, { useState } from 'react';
import Microfrontend from  './Microfrontend';

import './App.css';

const App = ({ microfrontends }) => {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    setMessages((currentMessages) => currentMessages.concat(message));
  };

  return (
    <main className="App">
      <div className="App__header">
        <h1>⚔️ Cross microfrontend communication 📦</h1>
        <p>Workerized example</p>
      </div>
      <div className="App__content">
        <div className="App__content-container">
          {
            Object.keys(microfrontends).map(microfrontend => (
              <Microfrontend
                key={microfrontend}
                microfrontend={microfrontends[microfrontend]}
                customProps={{
                  messages,
                  onNewMessage: handleNewMessage,
                }}
              />
            ))
          }
        </div>
      </div>
    </main>
  );
}

export default withMicrofrontend(App);
