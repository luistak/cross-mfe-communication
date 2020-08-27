import { withMicrofrontend } from 'react-microfrontend';

import React from 'react';

import Microfrontend from  './Microfrontend';

import './App.css';

const App = ({ microfrontends }) => (
  <main className="App">
    <div className="App__header">
      <h1>⚔️ Cross microfrontend communication 📦</h1>
      <p>Windowed Observable example</p>
    </div>
    <div className="App__content">
      <div className="App__content-container">
        {
          Object.keys(microfrontends).map(microfrontend => (
            <Microfrontend
              key={microfrontend}
              microfrontend={microfrontends[microfrontend]}
            />
          ))
        }
      </div>
    </div>
  </main>
);

export default withMicrofrontend(App);
