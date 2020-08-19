import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ImportMicrofrontend } from 'react-microfrontend';
import worky from 'worky';

function bli() {
	worky.say(123);
};

window.worky = worky;
window.bli = bli;

window.__shared__.ContainerReact = React;

ReactDOM.render((
	<ImportMicrofrontend>
		<App />
	</ImportMicrofrontend>
), document.getElementById('root'));
