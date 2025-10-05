// database/collection.js
const books = require("./books");

// Return all
function find() {
  return books;
}

// Return one by numeric id
function findOne(id) {
  const numId = Number(id);
  if (Number.isNaN(numId)) return undefined;
  return books.find((b) => b.id === numId);
}

// Create a new book (requires title). Generates next numeric id.
function create(payload) {
  const { title, author, year } = payload || {};
  if (!title || typeof title !== "string" || title.trim() === "") {
    const err = new Error("title is required");
    err.status = 400;
    throw err;
  }
  const nextId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
  const book = {
    id: nextId,
    title: title.trim(),
    author: author || "",
    year: year ?? null,
  };
  books.push(book);
  return book;
}

// Update an existing book by id (requires title). Returns true if updated.
function update(id, payload) {
  const numId = Number(id);
  if (Number.isNaN(numId)) {
    const err = new Error("id must be a number");
    err.status = 400;
    throw err;
  }

  const { title, author, year } = payload || {};
  if (!title || typeof title !== "string" || title.trim() === "") {
    const err = new Error("Bad Request");
    err.status = 400;
    throw err;
  }

  const idx = books.findIndex((b) => b.id === numId);
  if (idx === -1) return false;

  books[idx] = {
    ...books[idx],
    title: title.trim(),
    ...(author !== undefined ? { author } : {}),
    ...(year !== undefined ? { year } : {}),
  };
  return true;
}

// Delete by id; returns true if removed, false otherwise
function remove(id) {
  const numId = Number(id);
  if (Number.isNaN(numId)) return false;
  const idx = books.findIndex((b) => b.id === numId);
  if (idx === -1) return false;
  books.splice(idx, 1);
  return true;
}

module.exports = { find, findOne, create, update, remove };
