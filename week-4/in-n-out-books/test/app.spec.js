/**
 * Chapter 3 & 4: API Tests
 */
const request = require("supertest");
const app = require("../src/app");
const books = require("../database/books");

// Reset dataset before each test
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
    const check = await request(app).get("/api/books/3");
    expect(check.statusCode).toBe(404);
  });
});
