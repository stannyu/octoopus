const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, Stas');
});

module.exports = { home: router };
