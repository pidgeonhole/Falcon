import React, {Component} from 'react';
import request from 'superagent';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import {
    Card,
    CardActions,
    CardHeader,
    CardTitle,
    CardText
} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import {cyan400} from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

// Render Markdown
import Markdown from 'react-markdown';

// Configs
import config from '../config';

// Enable syntax highlighting for supported languages
import Codemirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/icecoder.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/r/r';


export default class AnswerSheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            markdown: null,
            code: 'print("Hello World")',
            mode: 'python',
            index: 0
        };

        // binding event handlers to the right context
        // so that this refers to the AnswerSheet class
        this.updateCode = this.updateCode.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentWillMount() {
        const body = {
            type: this.props.params.type,
            name: this.props.params.name
        }

        request
            .post(config.dev_test_q)
            .send(JSON.stringify(body))
            .then((res) => {
                this.setState({markdown: res.text});
              }, err => {
                console.error("Couldn't get html");
            });
    }

    namify(word) {
        word = word.replace(/\_/g, ' '); // replace underscores with spaces
        // Title Case the whole word
        word = word.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
        return word;
    }

    renderContent() {
        if (!this.state.markdown) {
            return (<div className="progress">
                <div className="indeterminate"></div>
            </div>);
        } else {
            return (
                <Markdown source={this.state.markdown} />
            );
        }
    }

    render() {
        const title = this.namify(this.props.params.type);
        const subtitle = this.namify(this.props.params.name);

        let options = {
        			lineNumbers: true,
        			mode: this.state.mode,
              indentUnit: 4
        		};
        const supported_languages = ['Python', 'R', 'Javascript'];

        return (
          <div>
              <br/>
              <MuiThemeProvider>
                  <Card>
                      <CardHeader title={title} subtitle={subtitle} avatar={
                        <Avatar backgroundColor={cyan400} size={40}>P
                        </Avatar>} />
                      <CardText>
                          { this.renderContent() }
                      </CardText>
                      <CardTitle title="Your Answer" />
                      <CardText>
                          <div style={{'border': '1px solid black'}}>
                          <Codemirror ref="editor"
                            value={this.state.code}
                            onChange={this.updateCode.bind(this)}
                            options={options} />
                          </div>
                          <div>
                          <SelectField floatingLabelText="Language"
                            value={supported_languages[this.state.index]}
                            onChange={this.updateMode.bind(this)}>
                              {supported_languages.map((e, i) => (
                                  <MenuItem value={e} key={i} primaryText={e}/>
                              ))}
                          </SelectField>
                          </div>
                      </CardText>
                      <CardActions>
                          <RaisedButton label="Submit"
                            secondary={true}
                            style={{'margin': '12px'}}
                            onClick={this.submit.bind(this)}/>
                      </CardActions>
                  </Card>
              </MuiThemeProvider>
		      </div>
        );
    }

    submit() {
        const code = this.state.code;
        const mode = this.state.mode;
        const data = JSON.stringify({
          code: code,
          mode: mode
        });

        request.post(config.dev_test_submit)
          .send(data)
          .then(res => {
              console.log(res);
          });
    }

    updateCode(code) {
        this.setState({code});
    }

    updateMode(event, index, mode) {
        this.setState({
          mode: mode.toLowerCase(),
          index: index
        });
    }
}
