import { withMicrofrontend } from 'react-microfrontend';

import React, { useState, useRef } from 'react';

import './App.css';

const App = ({ microfrontends }) => {
  const mfRef = useRef();
  const [selectedMicrofrontendKey, setSelectedMicrofrontendKey] = useState(undefined);

  const MicrofrontendApi = selectedMicrofrontendKey
    ? microfrontends[selectedMicrofrontendKey]
    : Object.values(microfrontends)[0];

  if (mfRef.current) {
    MicrofrontendApi.view(mfRef.current);
  }

  return (
    <div className="App">
      <p className="App__header">
        Welcome to Microfrontend World.
        <br />
        Choose a microfrontend to show:
      </p>
      <div className="App__menu">
        {
          Object.keys(microfrontends).map(microfrontend => (
            <button
              onClick={() => setSelectedMicrofrontendKey(microfrontend)}
              key={microfrontend}
              className={`App__menu-item${microfrontend === selectedMicrofrontendKey ? ' App__menu-item--selected' : ''}`}
            >
              {microfrontend}
            </button>
          ))
        }
      </div>
      <div className="App__content">
        <div className="App__microfrontend-content" ref={mfRef} />
        {/* {
          MicrofrontendComponent && (
            <div className="App__microfrontend-content">
              <MicrofrontendComponent.view />
            </div>
          )
        } */}
      </div>
    </div>
  );
};
export default withMicrofrontend(App);
