function url(endpoint){
  switch (process.env.NODE_ENV) {
    case "production":
      return `${process.env.IP}${endpoint}`;
    case "staging":
      return `${process.env.IP}${endpoint}`;
    default:
      throw `process.env.NODE_ENV (${process.env.NODE_ENV}) variable unrecognized.`;
  }
}

function problem(id) {
  // returns url for problem given category and question identifier
  return `${url('problems')}/${id}`;
}

const config = {
  categories: url('categories'),
  problem: problem,
  submit: url('submit')
};

export default config;
