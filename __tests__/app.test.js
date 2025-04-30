const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection.js");
const app = require("../api.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
require("jest-sorted");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        console.log(endpoints);
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /topics", () => {
  test("200: Responds with an object", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("200: Responds with an object of topics that contain a 'slug' property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
        });
      });
  });
  test("200: Responds with an object of topics that contain a 'description' property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /article/:article_id", () => {
  test("200: Responds with an object", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("200: Responds with an article object that contains an 'author' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("author", expect.any(String));
      });
  });
  test("200: Responds with an article object that contains a 'title' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("title", expect.any(String));
      });
  });
  test("200: Responds with an article object that contains a 'article_id' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("article_id", expect.any(Number));
      });
  });
  test("200: Responds with an article object that contains a 'body' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("body", expect.any(String));
      });
  });
  test("200: Responds with an article object that contains a 'topic' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("topic", expect.any(String));
      });
  });
  test("200: Responds with an article object that contains a 'created_at' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("200: Responds with an article object that contains a 'votes' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("votes", expect.any(Number));
      });
  });
  test("200: Responds with an article object that contains an 'article_img_url' property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("200: Tests that articles objects have an author key", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((object) => {
          expect(object).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String)
          });
        });
      });
  });
  test("200: Tests that the articles are returned in descending order of their creation date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("Error handling", () => {
  describe("GET /topics", () => {
    test("404: Returns 404 error when an incorrect path is provided", () => {
      return request(app)
        .get("/api/topisc")
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe("Not found");
        });
    });
  });
  describe("GET /article/:article_id", () => {
    test("400: Returns 400 error when a bad request is made", () => {
      return request(app)
        .get("/api/articles/newspaper")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad request");
        });
    });
  });
});
