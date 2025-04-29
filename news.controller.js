const { requestTopics, requestArticle } = require("./news.model.js");
const endpointsJson = require("./endpoints.json");

const getApi = (req, res, next) => {
  return res.status(200).send({ endpoints: endpointsJson });
};

const getTopics = (req, res, next) => {
  requestTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getApi, getTopics, getArticleById };
