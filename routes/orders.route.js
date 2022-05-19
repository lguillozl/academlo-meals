const express = require('express');

const { orderExists } = require('../middlewares/orders.middleware');
const { protectToken } = require('../middlewares/users.middleware');
const {
  createOrderValidations,
  checkValidations,
} = require('../middlewares/validations.middleware');

const {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orders.controller');

const router = express.Router();

router.use(protectToken);

router.post('/', createOrderValidations, checkValidations, createOrder);
router.get('/me', getAllOrders);
router.patch('/:id', orderExists, updateOrder);
router.delete('/:id', orderExists, deleteOrder);

module.exports = { ordersRouter: router };
