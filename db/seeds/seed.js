const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics ( 
    slug VARCHAR(100) PRIMARY KEY, 
    description VARCHAR(1000) NOT NULL,
    img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users ( 
      username VARCHAR(100) UNIQUE PRIMARY KEY, 
      name VARCHAR(100) NOT NULL,
      avatar_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles ( 
        article_id SERIAL PRIMARY KEY, 
        title VARCHAR(100),
        topic VARCHAR(100) REFERENCES topics(slug),
        author VARCHAR(100) REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT(0),
        article_img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id),
          body TEXT,
          votes INT DEFAULT(0),
          author VARCHAR(100) REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);
    })
    .then(() => {
      const formattedTopicsData = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const topicQuery = format(
        `INSERT INTO topics (slug, description, img_url)
        VALUES %L`,
        formattedTopicsData
      );
      return db.query(topicQuery);
    })
    .then(() => {
      const formattedUsersData = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const userQuery = format(
        `INSERT INTO users (username, name, avatar_url)
        VALUES %L`,
        formattedUsersData
      );
      return db.query(userQuery);
    })
    .then(() => {
      const formattedArticleData = articleData.map((article) => {
        const convertedArticleData = convertTimestampToDate(article);
        return [
          convertedArticleData.title,
          convertedArticleData.topic,
          convertedArticleData.author,
          convertedArticleData.body,
          convertedArticleData.created_at,
          convertedArticleData.votes,
          convertedArticleData.article_img_url,
        ];
      });
      const articleQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L RETURNING *`,
        formattedArticleData
      );
      return db.query(articleQuery);
    })
    .then((result) => {
      const articlesRefObj = createRef(result.rows);
      const formattedComments = commentData.map((comment) => {
        const convertedComments = convertTimestampToDate(comment);
        return [
          articlesRefObj[comment.article_title],
          convertedComments.body,
          convertedComments.votes,
          convertedComments.author,
          convertedComments.created_at,
        ];
      });
      const commentQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES %L`,
        formattedComments
      );

      return db.query(commentQuery);
    })
    .then((result) => {
      console.log(result)
      console.log("Seeding complete");
    });
};

module.exports = seed;
