/**
 * File: src/app.js
 * Description: JSON Web Service for In-N-Out-Books (Hands-On 3.1 + 4.1)
 */
const express = require("express");
const { find, findOne, create, remove } = require("../database/collection");

const app = express();
app.use(express.json()); // body parser for POST JSON

// GET /api/books -> array of books
app.get("/api/books", (req, res) => {
  try {
    return res.status(200).json(find());
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /api/books/:id -> one book by id (400 if id not number)
app.get("/api/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "id must be a number" });
    }
    const book = findOne(id);
    if (!book) return res.status(404).json({ message: "book not found" });
    return res.status(200).json(book);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /api/books -> create a book (201), 400 if title missing
app.post("/api/books", (req, res) => {
  try {
    const created = create(req.body);
    res.set("Location", `/api/books/${created.id}`);
    return res.status(201).json(created);
  } catch (err) {
    const status = err.status || 500;
    return res
      .status(status)
      .json({ message: err.message || "Internal Server Error" });
  }
});

// DELETE /api/books/:id -> delete a book (204)
app.delete("/api/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "id must be a number" });
    }
    const ok = remove(id);
    return ok
      ? res.status(204).send()
      : res.status(404).json({ message: "book not found" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`JSON service running at http://localhost:${PORT}`)
  );
}
