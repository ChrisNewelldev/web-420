/**
 * File: src/app.js
 * Description: JSON Web Service for In-N-Out-Books (Ch.3–6)
 */
const express = require("express");
const bcrypt = require("bcryptjs");
const {
  find,
  findOne,
  create,
  update,
  remove,
} = require("../database/collection");
const users = require("../database/users");

const app = express();
app.use(express.json());

// ------- Books (existing) -------
app.get("/api/books", (req, res) => {
  try {
    return res.status(200).json(find());
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

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

app.put("/api/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    const ok = update(id, req.body); // throws 400 if bad input
    if (!ok) return res.status(404).json({ message: "book not found" });
    return res.status(204).send();
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
});

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

// ------- Auth (new for Ch.6) -------
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 400: missing input
    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const user = users.find((u) => u.email === String(email).toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ok = bcrypt.compareSync(String(password), user.password);
    if (!ok) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ message: "Authentication successful" });
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
