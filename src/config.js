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
  all_questions: url('test_questions'),
  question: url('question'),
  solution: url('solution'),
  html: url('somehtml'),
  submit: url('submit')
};

export default configs;
