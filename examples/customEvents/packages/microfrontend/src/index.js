import React from 'react';
import ReactDOM from 'react-dom';
import { ExportMicrofrontend } from 'react-microfrontend';

import App  from './App';

ExportMicrofrontend({
  name: 'microfrontend',
  view: function renderMicrofrontend(container, customProps = {}) {
    ReactDOM.render(<App {...customProps} />, container);
  }
});
