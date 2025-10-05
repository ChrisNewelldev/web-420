// database/users.js
const bcrypt = require("bcryptjs");

module.exports = [
  {
    id: 1,
    email: "student@example.com",
    password: bcrypt.hashSync("password123", 10),
    // three security question answers, order matters
    securityAnswers: ["blue", "fluffy", "austin"], // e.g., color, pet, city
  },
  {
    id: 2,
    email: "instructor@example.com",
    password: bcrypt.hashSync("teachsecure", 10),
    securityAnswers: ["green", "sparky", "denver"],
  },
];
