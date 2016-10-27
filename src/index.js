import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

// To fix Material UI touch events
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Home from './components/home';
import AnswerSheet from './components/answerSheet';

import "./stylesheets/main.css";

ReactDOM.render(
    <Router history={browserHistory}>
    <Route path='/' component={Home}/>
    <Route path='/problems/:type/:name' component={AnswerSheet}/>
</Router>, document.getElementById('app'));
