import React from 'react';
import ReactDOM from 'react-dom';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './index.css';
import App from './App';
import DashboardListSidebar from './Components/DashboardListSidebar'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<DashboardListSidebar />, document.getElementById('dasbhoard-list'));

registerServiceWorker();
