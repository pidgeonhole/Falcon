import React, {Component} from 'react';
import CardIntro from './cardIntro';
import QuestionList from './questionList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Home extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <CardIntro/>
                    <QuestionList/>
                </div>
            </MuiThemeProvider>
        );
    }
}
