const express = require('express');
const axios = require('axios');

const router = express.Router();

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://gateway:9001';

router.get('/', async (req, res) => {
  try {
    const {data: orders} = await axios.get(`${GATEWAY_URL}/api/order/orders`);
    res.render('orders', {
      title: 'Orders',
      orders: Array.isArray(orders) ? orders : [],
      error: null,
    });
  } catch (err) {
    res.render('orders', {
      title: 'Orders',
      orders: [],
      error: "Impossible de joindre l'API Gateway (order).",
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {customer, bookTitle, quantity} = req.body;
    await axios.post(`${GATEWAY_URL}/api/order/orders`, {
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
