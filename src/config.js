function url(endpoint){
  switch (process.env.NODE_ENV) {
    case "production":
      return `http://128.199.120.230/test/${endpoint}`;
    case "staging":
      return `http://localhost:5000/test/${endpoint}`;
    default:
      throw `process.env.NODE_ENV (${process.env.NODE_ENV}) variable unrecognized.`;
  }
}

const configs = {
  dev_test_questions: url('test_questions'),
  dev_test_q: url('question'),
  dev_test_s: url('solution'),
  dev_test_html: url('somehtml'),
  dev_test_submit: url('submit')
};

export default configs;
