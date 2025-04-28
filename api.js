const { getApi } = require("./news.controller.js")
const db = require("./db/connection.js");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api", getApi)

module.exports = app