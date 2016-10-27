const url = endpoint => `http://localhost:5000/test/${endpoint}`;

const configs = {
  dev_test_questions: url('test_questions'),
  dev_test_q: url('question'),
  dev_test_s: url('solution'),
  dev_test_html: url('somehtml'),
  dev_test_submit: url('submit')
};

export default configs;
