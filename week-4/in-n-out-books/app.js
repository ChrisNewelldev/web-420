/**
 * File: app.js
 * Author: Chris Newell
 * Date: 2025-10-06
 * Description: Express web server for In-N-Out-Books (WEB-420 Hands-On 2.1)
 */

const path = require('path');
const express = require('express');
const app = express();

// Serve static files (CSS, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// GET / — landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>404 - Not Found</h1><p>The requested page was not found.</p>');
});

// 500 handler
app.use((err, req, res, next) => {
  const response = { message: 'Internal Server Error' };
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;
  res.status(500).json(response);
});

// Export app (for testing later)
module.exports = app;

// Start server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}
