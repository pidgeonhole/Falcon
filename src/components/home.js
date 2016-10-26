'use strict';

import React, {Component} from 'react';
import CardIntro from './cardIntro';
import QuestionList from './questionList';

export default class Home extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <CardIntro/>
                <QuestionList/>
            </div>
        );
    }
}
