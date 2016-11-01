import React, {Component} from 'react';
import request from 'superagent';

import {deepPurple600} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';

import md from 'markdown-it';
import katex from 'markdown-it-katex';
import Highlight from 'react-highlight';


class Markdown extends Component {
    constructor(props) {
      super(props);

      let m = md();
      m.use(katex);
      this.state = {m};
    }

    componentWillMount() {

      const src = this.props.source;
      const body = JSON.stringify({
        type: this.props.type,
        name: this.props.name
      });

      request.post(src)
        .send(body)
        .then((res) => {
            this.setState({
              markdown: res.text
            });
        },
        err => console.log(err));
    }

    render() {
      if (!this.state.markdown) {
          return (
              <LinearProgress mode="indeterminate" color={deepPurple600}/>
          );
      }

      let text = this.state.m.render(this.state.markdown);

      return (
          <Highlight innerHTML={true}>
            {text}
          </Highlight>
      );
    }
}

export default Markdown;
