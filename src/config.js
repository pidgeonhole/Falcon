if (process.env.NODE_ENV === "production") {
  let url = endpoint => `http://128.199.120.230/test/${endpoint}`;
} else if (process.env.NODE_ENV === "staging") {
  let url = endpoint => `http://localhost:5000/test/${endpoint}`;
} else {
  throw `process.env.NODE_ENV (${process.env.NODE_ENV}) variable unrecognized.`;
}

console.log(process.env.NODE_ENV);

const configs = {
  dev_test_questions: url('test_questions'),
  dev_test_q: url('question'),
  dev_test_s: url('solution'),
  dev_test_html: url('somehtml'),
  dev_test_submit: url('submit')
};

export default configs;
