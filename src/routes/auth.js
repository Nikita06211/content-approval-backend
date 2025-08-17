const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
  res.json({ message: 'Signup route works!' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login route works!' });
});

module.exports = router;
