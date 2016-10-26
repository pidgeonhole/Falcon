'use strict!';

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Home from './components/home';

import "./stylesheets/main.css";

const App = () => (
    <MuiThemeProvider>
        <Home />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));
