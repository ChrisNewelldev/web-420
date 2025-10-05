/**
 * File: src/app.js
 * Author: Chris Newell
 * Description: JSON Web Service for In-N-Out-Books (Hands-On 3.1)
 */
const express = require('express');
const { find, findOne } = require('../database/collection');

const app = express();

// GET /api/books -> array of books
app.get('/api/books', (req, res) => {
  try {
    const data = find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/books/:id -> one book by id
app.get('/api/books/:id', (req, res) => {
  try {
    const { id } = req.params;

    // requirement: return 400 if id is NOT a number
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: 'id must be a number' });
    }

    const book = findOne(id);
    if (!book) {
      // not required by the prompt, but nice to have
      return res.status(404).json({ message: 'book not found' });
    }
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// export app for testing
module.exports = app;

// allow running directly: node src/app.js
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`JSON service running at http://localhost:${PORT}`));
}
