// database/users.js
// Generate hashes at load time so tests always match.
const bcrypt = require("bcryptjs");

module.exports = [
  {
    id: 1,
    email: "student@example.com",
    password: bcrypt.hashSync("password123", 10), // <- matches the test
  },
  {
    id: 2,
    email: "instructor@example.com",
    password: bcrypt.hashSync("teachsecure", 10),
  },
];
