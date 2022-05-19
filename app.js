const express = require('express');
const rateLimit = require('express-rate-limit');

const { globalErrorsHandler } = require('./controllers/errors.controller');

const { mealsRouter } = require('./routes/meals.route');
const { ordersRouter } = require('./routes/orders.route');
const { restaurantsRouter } = require('./routes/restaurants.route');
const { usersRouter } = require('./routes/users.route');

const app = express();

app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 10000,
  message: 'Too many requests from this IP address',
});
app.use(limiter);

app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/restaurants', restaurantsRouter);
app.use('/api/v1/users', usersRouter);
app.use('*', globalErrorsHandler);

module.exports = { app };
