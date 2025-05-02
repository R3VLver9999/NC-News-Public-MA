const db = require("./db/connection.js");

const requestTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const requestArticles = (
  sort_criteria = "created_at",
  order = "DESC",
  topic = "NULL"
) => {
  const sortGreenlist = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_id",
  ];
  const orderGreenlist = ["ASC", "DESC"];
  if (
    !sortGreenlist.includes(sort_criteria) ||
    !orderGreenlist.includes(order)
  ) {
    return Promise.reject({ status: 404, message: "Invalid input" });
  } else if (
    sortGreenlist.includes(sort_criteria) &&
    orderGreenlist.includes(order)
  ) {
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_criteria} ${order};`
      )
      .then(({ rows }) => {
        if (topic === "NULL") {
          return rows;
        } else if (topic !== "NULL") {
          const updatedRows = rows.filter((article) => article.topic === topic);
          if (updatedRows.length === 0) {
            return Promise.reject({
              status: 404,
              message: "Found no articles with this topic",
            });
          } else {
            return updatedRows;
          }
        }
      });
  }
};

const requestArticle = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count
FROM articles 
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = $1
GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article_id not found" });
      } else {
        return rows[0];
      }
    });
};

const requestCommentsFromArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article_id not found" });
      } else {
        return rows;
      }
    });
};

const requestUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

const addNewComment = (comment, article_id) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING author, body`,
      [article_id, comment.username, comment.body]
    )
    .then(({ rows }) => {
      rows[0].username = rows[0].author;
      delete rows[0].author;
      return rows[0];
    });
};

const requestUpdateVotes = (addedVotes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [addedVotes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "comment_id not found" });
      }
    });
};

const requestDeleteComment = (comment_id) => {
  return checkCommentExists(comment_id).then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
  });
};

module.exports = {
  requestTopics,
  requestArticles,
  requestArticle,
  requestCommentsFromArticle,
  addNewComment,
  requestUpdateVotes,
  requestDeleteComment,
  requestUsers,
};
