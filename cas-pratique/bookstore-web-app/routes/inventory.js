const express = require('express');
const axios = require('axios');

const router = express.Router();

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://gateway:9001';

router.get('/', async (req, res) => {
  try {
    const {data: books} = await axios.get(
      `${GATEWAY_URL}/api/inventory/books`,
    );
    res.render('inventory', {
      title: 'Inventory',
      books: Array.isArray(books) ? books : [],
      error: null,
    });
  } catch (err) {
    res.render('inventory', {
      title: 'Inventory',
      books: [],
      error: "Impossible de joindre l'API Gateway (inventory).",
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {title, author} = req.body;
    await axios.post(`${GATEWAY_URL}/api/inventory/books`, {title, author});
    res.redirect('/inventory');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
