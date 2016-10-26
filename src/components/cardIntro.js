import React, {Component} from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';

export default class CardIntro extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Card>
                <CardTitle title="Welcome to ESD's very own tutor"/>
                <CardText>
                    This application contains some questions which can be solved by the knowledge
                    that you've learnt throughout your ESD course. Of course, some may require you
                    to read out of the textbook. But we hope you'll still be challenged and find the
                    job in coding out solutions. We believe that if you can teach a computer how to
                    get things done, it must also mean you more or less know how to do it too!!

                    <br/><br/>

                    Visit our <a href="/#">tutorial</a> to help you get acquainted with the application.
                </CardText>
            </Card>
        );
    }
}
