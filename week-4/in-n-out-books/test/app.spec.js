// test/app.spec.js
// Full suite for Chapters 3–7

const request = require("supertest");
const app = require("../src/app");
const books = require("../database/books");

// Reset the mock books before every test so results are predictable
const initial = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    year: 1999,
  },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
  {
    id: 3,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    year: 2017,
  },
];
beforeEach(() => {
  books.length = 0;
  books.push(...initial.map((b) => ({ ...b })));
});

/* -------------------- Chapter 3 -------------------- */
describe("Chapter 3: API Tests", () => {
  it("Should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Should return a single book", async () => {
    const res = await request(app).get("/api/books/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("Should return a 400 error if the id is not a number", async () => {
    const res = await request(app).get("/api/books/abc");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "id must be a number" });
  });
});

/* -------------------- Chapter 4 -------------------- */
describe("Chapter 4: API Tests", () => {
  it("Should return a 201-status code when adding a new book", async () => {
    const payload = {
      title: "Refactoring",
      author: "Martin Fowler",
      year: 1999,
    };
    const res = await request(app).post("/api/books").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.headers).toHaveProperty("location");
    expect(res.body).toHaveProperty("id");
    expect(res.body).toMatchObject(payload);
  });

  it("Should return a 400-status code when adding a new book with missing title", async () => {
    const res = await request(app).post("/api/books").send({ author: "Anon" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "title is required" });
  });

  it("Should return a 204-status code when deleting a book", async () => {
    const res = await request(app).delete("/api/books/3");
    expect(res.statusCode).toBe(204);
  });
});

/* -------------------- Chapter 5 (PUT) -------------------- */
describe("Chapter 5: API Tests (PUT)", () => {
  it("Should update a book and return a 204-status code", async () => {
    const res = await request(app)
      .put("/api/books/2")
      .send({ title: "Clean Code (Updated)", author: "Robert C. Martin" });
    expect(res.statusCode).toBe(204);

    const check = await request(app).get("/api/books/2");
    expect(check.statusCode).toBe(200);
    expect(check.body.title).toBe("Clean Code (Updated)");
  });

  it("Should return a 400-status code when using a non-numeric id", async () => {
    const res = await request(app).put("/api/books/foo").send({ title: "x" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("id must be a number");
  });

  it("Should return a 400-status code when updating with a missing title", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({ author: "Only Author" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Bad Request");
  });
});

/* -------------------- Chapter 6 (Auth) -------------------- */
describe("Chapter 6: API Tests (Auth)", () => {
  it('Should log a user in and return 200 with "Authentication successful"', async () => {
    const res = await request(app).post("/api/login").send({
      email: "student@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Authentication successful" });
  });

  it('Should return 401 with "Unauthorized" for incorrect credentials', async () => {
    const res = await request(app).post("/api/login").send({
      email: "student@example.com",
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });

  it('Should return 400 with "Bad Request" when missing email or password', async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "student@example.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Bad Request" });
  });
});

/* -------------------- Chapter 7 (Security Q&A) -------------------- */
describe("Chapter 7: API Tests (Security Questions)", () => {
  it('Should return 200 with "Security questions successfully answered"', async () => {
    const res = await request(app)
      .post("/api/users/student@example.com/verify-security-question")
      .send([{ answer: "blue" }, { answer: "fluffy" }, { answer: "austin" }]);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Security questions successfully answered",
    });
  });

  it("Should return 400 Bad Request when body fails AJV validation", async () => {
    const res = await request(app)
      .post("/api/users/student@example.com/verify-security-question")
      .send({ answer: "blue" }); // invalid shape
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Bad Request" });
  });

  it("Should return 401 Unauthorized when answers are incorrect", async () => {
    const res = await request(app)
      .post("/api/users/student@example.com/verify-security-question")
      .send([{ answer: "red" }, { answer: "wrong" }, { answer: "nope" }]);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });
});
