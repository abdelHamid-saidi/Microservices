const express = require('express');
const axios = require('axios');

const router = express.Router();

const API_URL = process.env.API_URL || 'http://loopback-bookstore:3000';

router.get('/', async (req, res) => {
  try {
    const {data: books} = await axios.get(`${API_URL}/books`);
    res.render('inventory', {
      title: 'Inventory',
      books: Array.isArray(books) ? books : [],
      error: null,
    });
  } catch (err) {
    res.render('inventory', {
      title: 'Inventory',
      books: [],
      error: "Impossible de joindre l'API LoopBack Bookstore.",
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {title, author} = req.body;
    await axios.post(`${API_URL}/books`, {title, author});
    res.redirect('/inventory');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
