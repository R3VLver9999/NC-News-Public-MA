const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection.js");
const app = require("../api.js")
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
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
        console.log(endpoints)
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

