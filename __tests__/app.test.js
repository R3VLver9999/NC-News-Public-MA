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
          expect(topic).toEqual({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String),
          });
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
  test("200: Tests that article object has the correct properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          body: expect.any(String),
        });
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
  test("200: Tests that articles objects have the correct properties", () => {
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
            comment_count: expect.any(String),
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an object", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("200: Tests that comments have the correct properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(2);
        response.body.comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
            author: expect.any(String),
          });
        });
      });
  });
  test("200: Tests that the comments are returned in ascending order of their creation date", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("200: Tests that request returns posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "Hello!",
        username: "butter_bridge",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          body: "Hello!",
          username: "butter_bridge",
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", ()=> {
  test("200: Request returns an updated article object with the correct number of inputted votes", ()=> {
    return request(app)
    .patch("/api/articles/3")
    .send({ addedVotes: 30 })
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: 3,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: 30,
        article_img_url: expect.any(String)
      })
    })
  })
})

describe("Error handling", () => {
  describe("GET /topics", () => {
    test("404: Returns 404 error when an incorrect path is provided", () => {
      return request(app)
        .get("/api/newspapers")
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
  describe("POST /api/articles/:article_id/comments", () => {
    test("500: Resturns a 500 error when an invalid username is given", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: "Hello!",
          username: "I AM ERROR",
        })
        .expect(500)
        .then(({ body }) => {
          expect(body.message).toBe("Internal server error");
        });
    });
    test("400: Resturns a 400 error when the comment body is empty", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: "",
          username: "butter_bridge",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", ()=> {
    test("400: Resturns a 400 error when the type of votes is not a number", () => {
      return request(app)
      .patch("/api/articles/3")
      .send({ addedVotes: "ERROR" })
      .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  })
});
