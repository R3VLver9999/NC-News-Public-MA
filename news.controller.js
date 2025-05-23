const {
  requestTopics,
  requestArticles,
  requestArticle,
  requestCommentsFromArticle,
  addNewComment,
  requestUpdateVotes,
  requestDeleteComment,
  requestUsers,
} = require("./news.model.js");
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
  const { sort_by } = req.query;
  const { order } = req.query;
  const { topic } = req.query;
  requestArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;

  return requestArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentById = (req, res, next) => {
  const article_id = req.params.article_id;

  return requestCommentsFromArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  requestUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  return addNewComment(comment, article_id)
    .then((comment) => {
      if (comment.body === "") {
        res.status(400).send({ message: "Bad request" });
      } else {
        res.status(201).send({ comment });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { addedVotes } = req.body;
  return requestUpdateVotes(addedVotes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return requestDeleteComment(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getApi,
  getTopics,
  getArticles,
  getArticleById,
  getCommentById,
  postComment,
  patchVotes,
  deleteComment,
  getUsers,
};
