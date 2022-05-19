const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

const createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { mealId, quantity } = req.body;

  const meal = await Meal.findByPk(mealId);

  if (!meal) {
    return next(new AppError('Meal not found', 404));
  }

  const totalPrice = meal.price * quantity;

  const newOrder = await Order.create({
    mealId,
    quantity,
    totalPrice,
    userId: sessionUser.id,
  });

  res.status(201).json({
    status: 'Your order was successfully created',
    newOrder,
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id, status: 'active' },
    attributes: ['id', 'quantity', 'totalPrice'],
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: [
          {
            model: Restaurant,
            attributes: ['name'],
          },
        ],
      },
    ],
  });

  res.status(200).json({
    status: 'Your orders were successfully fetched',
    orders,
  });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
  });

  if (sessionUser.id !== order.userId && sessionUser.role !== 'admin') {
    return next(
      new AppError(
        'Forbidden. Access permited only to owner or the admin!',
        403
      )
    );
  }
  order.update({ status: 'completed' });

  res.status(200).json({
    status: 'Your order was successfully completed',
  });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
  });

  if (sessionUser.id !== order.userId && sessionUser.role !== 'admin') {
    return next(
      new AppError(
        'Forbidden. Access permited only to owner or the admin!',
        403
      )
    );
  }
  order.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'Your order was successfully cancelled',
  });
});

module.exports = { createOrder, getAllOrders, updateOrder, deleteOrder };
