// database/collection.js
const books = require('./books');

// Return all
function find() {
  return books;
}

// Return one by numeric id
function findOne(id) {
  const numId = Number(id);
  if (Number.isNaN(numId)) return undefined;
  return books.find(b => b.id === numId);
}

module.exports = { find, findOne };
