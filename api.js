const { getApi, getTopics, getArticles, getArticleById, getCommentById, postComment, patchVotes, deleteComment, getUsers } = require("./news.controller.js")

const db = require("./db/connection.js");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentById)

app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchVotes)

app.delete("/api/comments/:comment_id", deleteComment)


app.use((err, req, res, next) => {
    if (err.status && err.message){
        res.status(err.status).send({message: err.message})
    }else{
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400).send({message: "Bad request"})
    }else{
        next(err);
    }
})

app.all('/*splat', (req, res, next) => {
    res.status(404).send({message: "Not found"})
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: "Internal server error" });
});

module.exports = app