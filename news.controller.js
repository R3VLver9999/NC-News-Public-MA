const { requestTopics,  requestArticles, requestArticle, requestCommentsFromArticle, addNewComment } = require("./news.model.js");
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

const getArticles = (req, res, next) => {
  requestArticles()
  .then((articles) => {
    res.status(200).send({ articles: articles })
  })
  .catch((err) => {
    next(err);
  });
}

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

const getCommentById = (req, res, next) => {
  const article_id = req.params.article_id

  return requestCommentsFromArticle(article_id)
  .then((comments) => {
      res.status(200).send({comments: comments})
  })
  .catch((err) => {
      next(err)
  })
}

const postComment = (req, res, next) => {
  const { article_id } = req.params
  const comment = req.body
  return addNewComment(comment, article_id)
  .then((comment) => {
    console.log(comment)
    if (comment.body === "") {
      res.status(400).send({message: "Bad request"})
    } else {
      res.status(201).send({comment})
    }
  })
}

module.exports = { getApi, getTopics, getArticles, getArticleById, getCommentById, postComment };
