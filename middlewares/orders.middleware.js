const { Order } = require('../models/order.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, status: 'active' },
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  req.order = order;
  next();
});

module.exports = { orderExists };
