import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import NavigationDrawer from './components/NavigationDrawer'
import registerServiceWorker from './registerServiceWorker';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
  custom: {
		families: ['FontAwesome'],
		urls: ['https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'],
	},
});

ReactDOM.render(<NavigationDrawer />, document.getElementById('root'));
registerServiceWorker();
