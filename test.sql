-- \c nc_news_test;
-- SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count
-- FROM articles
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id
-- ORDER BY created_at DESC;

-- DELETE FROM comments WHERE comment_id = $2 AND article_id = $1; 