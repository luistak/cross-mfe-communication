import React from 'react';
import ReactDOM from 'react-dom';

import { ExportMicrofrontend } from 'react-microfrontend';
import App from './App';

ExportMicrofrontend({
  name: 'microfrontend2',
  view: function renderMicrofrontend2(container) {
    ReactDOM.render(<App />, container);
  }
});
