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
        const url = `${config.categories}/?expand=problems`;
        request.get(url).end((error, response) => {
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
                {list.map(e => (
                  <CollapsibleItem header={e.name} key={e.id}>
                    <List>
                      {e.problems.map(p => {
                        const url = `/problems/${e.name}/${p.title}/${p.id}`.replace(/\s/g, '-');
                        return (
                          <Link to={url} key={p.id}>
                            <ListItem>{p.title}</ListItem>
                          </Link>
                        )
                      })}
                    </List>
                  </CollapsibleItem>
                ))}
              </Collapsible>
            </div>
          );
    }
}
