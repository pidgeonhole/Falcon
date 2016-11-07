function url(endpoint){
  switch (process.env.NODE_ENV) {
    case "production":
      return `http://128.199.120.230/v1/${endpoint}`;
    case "staging":
      return `http://139.59.241.214:3000/v1/${endpoint}`;
    default:
      throw `process.env.NODE_ENV (${process.env.NODE_ENV}) variable unrecognized.`;
  }
}

function problem(id) {
  // returns url for problem given category and question identifier
  return `${url('problems')}/${id}`;
}

const configs = {
  categories: url('categories'),
  problem: problem,
  submit: url('submit')
};

export default configs;
