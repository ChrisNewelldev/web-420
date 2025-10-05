/**
 * File: src/app.js
 * Description: JSON Web Service for In-N-Out-Books (Hands-On 3.1 + 4.1 + 5.1)
 */
const express = require("express");
const {
  find,
  findOne,
  create,
  update,
  remove,
} = require("../database/collection");

const app = express();
app.use(express.json());

// GET all
app.get("/api/books", (req, res) => {
  try {
    return res.status(200).json(find());
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET by id (400 if id not number)
app.get("/api/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (Number.isNaN(Number(id)))
      return res.status(400).json({ message: "id must be a number" });
    const book = findOne(id);
    if (!book) return res.status(404).json({ message: "book not found" });
    return res.status(200).json(book);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST create (201) / 400 if title missing
app.post("/api/books", (req, res) => {
  try {
    const created = create(req.body);
    res.set("Location", `/api/books/${created.id}`);
    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
});

// PUT update (204) / 400 if id non-numeric / 400 if title missing
app.put("/api/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    const ok = update(id, req.body); // throws 400 for bad id/title
    if (!ok) return res.status(404).json({ message: "book not found" });
    return res.status(204).send();
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
});

// DELETE (204)
app.delete("/api/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (Number.isNaN(Number(id)))
      return res.status(400).json({ message: "id must be a number" });
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
