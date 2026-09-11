const express = require('express');
const axios = require('axios');

const router = express.Router();

const ORDER_API_URL =
  process.env.ORDER_API_URL || 'http://loopback-order:3001';

router.get('/', async (req, res) => {
  try {
    const {data: orders} = await axios.get(`${ORDER_API_URL}/orders`);
    res.render('orders', {
      title: 'Orders',
      orders: Array.isArray(orders) ? orders : [],
      error: null,
    });
  } catch (err) {
    res.render('orders', {
      title: 'Orders',
      orders: [],
      error: "Impossible de joindre l'API LoopBack Order.",
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {customer, bookTitle, quantity} = req.body;
    await axios.post(`${ORDER_API_URL}/orders`, {
      customer,
      bookTitle,
      quantity: Number(quantity),
    });
    res.redirect('/orders');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
