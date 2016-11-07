import React, { Component } from 'react';
import request from 'superagent';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import { cyan400, deepPurple600 } from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// Render Markdown
// import Markdown from 'react-markdown';
import Markdown from './markdownRenderer';

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
            code: 'print("Hello World!")',
            language: 'python',
            index: 0,
            submitDisabled: false,
            result: null,
            showResults: false
        };

        // binding event handlers to the right context
        // so that this refers to the AnswerSheet class
        this.updateCode = this.updateCode.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.submit = this.submit.bind(this);
        this.dialogClose = this.dialogClose.bind(this);
    }

    componentWillMount() {
        request.get(config.problem(this.props.params.id))
            .then(res => {
                let text = decodeURIComponent(res.body.description);
                this.setState({markdown: text});
              }, err => {
                console.error("Couldn't get html");
            });
    }

    dialog() {
      const actions = [
         <FlatButton
           label="Close"
           primary={true}
           keyboardFocused={true}
           onTouchTap={this.dialogClose}
         />
     ];
     const results = this.state.result;
     if (!results) return;

     let title = `Results\t${results.success ? ":D" : ":("}`;

     return (
       <Dialog
         title={title}
         actions={actions}
         modal={false}
         open={this.state.showResults}
         onRequestClose={this.dialogClose}>
         You passed {results.tests_passed}/{results.num_tests}. Jiayu says: {results.message}.
       </Dialog>
     )
    }

    dialogClose() { this.setState({showResults: false}); }

    namify(word) {
        word = word.replace(/\-/g, ' '); // replace underscores with spaces
        // Title Case the whole word
        word = word.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
        return word;
    }

    render() {
        const title = this.namify(this.props.params.type);
        const subtitle = this.namify(this.props.params.name);

        let options = {
        			lineNumbers: true,
        			language: this.state.language,
              indentUnit: 4
        		};
        const supported_languages = ['Python', 'R'];

        let core = (<LinearProgress mode="indeterminate" color={deepPurple600}/>);
        if(this.state.markdown) core = (<Markdown markdown={this.state.markdown}/>);

        return (
          <div>
            <br/>
            <MuiThemeProvider>
              <div>
              <Card>
                <CardHeader title={title} subtitle={subtitle} avatar={
                  <Avatar backgroundColor={cyan400} size={40}>P
                  </Avatar>} />
                <CardText>
                  {core}
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
                    disabled={this.state.submitDisabled}
                    secondary={true}
                    style={{'margin': '12px'}}
                    onClick={this.submit.bind(this)}/>
                </CardActions>
              </Card>
              {this.dialog()}
            </div>
            </MuiThemeProvider>
		      </div>
        );
    }

    submit() {
        const data = {
          source_code: encodeURIComponent(this.state.code),
          language: this.state.language
        };
        this.setState({
          submitDisabled: true
        })

        request.post(config.submit(this.props.params.id))
        .send(data)
        .then(res => {
          console.log(res.body);
          this.setState({
            result: res.body,
            submitDisabled: false,
            showResults: true
          });
        })
    }

    updateCode(code) {
        this.setState({code});
    }

    updateMode(event, index, language) {
        this.setState({
          language: language.toLowerCase(),
          index: index
        });
    }
}
