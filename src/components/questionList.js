import React, {Component} from 'react';
import {Link} from 'react-router';
import request from 'superagent';
import config from '../config';
import {Collapsible, CollapsibleItem} from 'react-materialize';
import {List, ListItem} from 'material-ui/List';

export default class QuestionList extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        request.get(config.all_questions).end((error, response) => {
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
              <Collapsible>
                {Object.keys(list).map((type, index) => (
                  <CollapsibleItem header={type} key={type}>
                    <List>
                      {list[type].map((q, i) => {
                        const url = `/problems/${type}/${q}`.toLowerCase().replace(/\s/g, '_');
                        return (
                          <Link to={url} key={i}>
                            <ListItem>{q}</ListItem>
                          </Link>
                        );
                      })}
                    </List>
                  </CollapsibleItem>
                ))}
              </Collapsible>
            </div>
        );
    }
}
