const db = require("./db/connection.js");

const requestTopics = () => {
    return db 
    .query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

const requestArticles = () => {
    return db 
    .query(`SELECT * FROM articles ORDER BY created_at DESC`)
    .then(({rows}) => {
        const newRows = rows.map(({body, ...values}) => values)
        return newRows
    })
}

const requestArticle = (article_id) => {
    return db 
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, message: "article_id not found"})
        } else {
            return rows[0]
        }
    })
}

module.exports = { requestTopics, requestArticles, requestArticle }
