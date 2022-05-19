const { Restaurant } = require('../models/restaurant.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

const restaurantExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError("Restaurant doesn't exist or isn't active", 404));
  }

  req.restaurant = restaurant;

  next();
});

module.exports = { restaurantExists };
