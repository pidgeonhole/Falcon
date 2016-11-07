import React, {Component} from 'react';
import request from 'superagent';

import md from 'markdown-it';
import katex from 'markdown-it-katex';
import Highlight from 'react-highlight';


class Markdown extends Component {
    constructor(props) {
      super(props);

      let m = md();
      m.use(katex);
      this.state = {
        m: m,
        markdown: this.props.markdown
      };
    }

    componentWillMount() {
      const src = this.props.source;
      if (!src || this.props.markdown) return;

      request.get(src)
        .then((res) => {
            this.setState({
              markdown: res.text
            });
        },
        err => console.error(err));
    }

    render() {
      let text = this.state.m.render(this.state.markdown);
      return (
          <Highlight innerHTML={true}>
            {text}
          </Highlight>
      );
    }
}

export default Markdown;
