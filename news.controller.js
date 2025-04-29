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

const getArticleById = (req, res, next) => {
  const article_id = req.params.article_id

  return requestArticle(article_id)
  .then((article) => {
      res.status(200).send(article)
  })
  .catch((err) => {
      next(err)
  })
}

module.exports = { getApi, getTopics, getArticleById };
