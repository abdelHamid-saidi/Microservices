const express = require('express');
const axios = require('axios');

const router = express.Router();

const PAYMENT_API_URL =
  process.env.PAYMENT_API_URL || 'http://loopback-payment:3002';

router.get('/', async (req, res) => {
  try {
    const {data: payments} = await axios.get(`${PAYMENT_API_URL}/payments`);
    res.render('payments', {
      title: 'Payments',
      payments: Array.isArray(payments) ? payments : [],
      error: null,
    });
  } catch (err) {
    res.render('payments', {
      title: 'Payments',
      payments: [],
      error: "Impossible de joindre l'API LoopBack Payment.",
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {orderRef, amount, method} = req.body;
    await axios.post(`${PAYMENT_API_URL}/payments`, {
      orderRef,
      amount: Number(amount),
      method,
    });
    res.redirect('/payments');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
