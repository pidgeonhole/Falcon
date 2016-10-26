import React, {Component} from 'react';
import ajax from 'superagent';
import config from '../config';
import {Collapsible, CollapsibleItem} from 'react-materialize';

export default class QuestionList extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        ajax.get(config.dev_test_questions).end((error, response) => {
            if (!error && response) {
                this.setState({list: response.body});
            }
        });
    }

    render() {
        let list = this.state.list;
        if (!list) {
            return (
                <div className="container">
                    <div>Loading..</div>
                </div>
            )
        }

        return (
            <div>
                <h4>Question List</h4>
                {/* <ul className="collapsible popout" data-collapsible="accordion">
                    {Object.keys(list).map((type, index) => (
                        <li key={index}>
                            {index == 0
                                ? <div className="collapsible-header active">{type}</div>
                                : <div className="collapsible-header">{type}</div>}
                            <div className="collapsible-body">
                                <ul>
                                    {list[type].map((q, i) => (
                                        <li key={i}>{q}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul> */}
                <Collapsible popout>
                    {Object.keys(list).map((type, index) => (
                        <CollapsibleItem header={type} key={type}>
                            <ul>
                                {list[type].map((q, i) => (
                                    <li key={i}>{q}</li>
                                ))}
                            </ul>
                        </CollapsibleItem>
                    ))}
                </Collapsible>
            </div>
        );
    }
}
