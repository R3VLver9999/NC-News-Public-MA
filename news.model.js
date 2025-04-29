const db = require("./db/connection.js");

const requestTopics = () => {
    return db 
    .query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = { requestTopics, requestArticle }
