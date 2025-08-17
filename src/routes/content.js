const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'Create content route works!' });
});

router.get('/', (req, res) => {
  res.json({ message: 'List content route works!' });
});

module.exports = router;
