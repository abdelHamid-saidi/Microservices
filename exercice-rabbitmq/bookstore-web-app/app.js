const express = require('express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');

const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);
app.use('/orders', ordersRouter);
app.use('/payments', paymentsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
