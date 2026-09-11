const express = require('express');
const axios = require('axios');

const router = express.Router();

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://gateway:9001';

router.get('/', async (req, res) => {
  try {
    const {data: payments} = await axios.get(
      `${GATEWAY_URL}/api/payment/payments`,
    );
    res.render('payments', {
      title: 'Payments',
      payments: Array.isArray(payments) ? payments : [],
      error: null,
    });
  } catch (err) {
    res.render('payments', {
      title: 'Payments',
      payments: [],
      error: "Impossible de joindre l'API Gateway (payment).",
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {orderRef, amount, method} = req.body;
    await axios.post(`${GATEWAY_URL}/api/payment/payments`, {
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
