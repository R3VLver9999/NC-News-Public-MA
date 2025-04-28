const {} = require("./news.model.js");
const endpointsJson = require("./endpoints.json");

const getApi = (req, res, next) => {
  return res.status(200).send({endpoints: endpointsJson});
};

module.exports = { getApi }