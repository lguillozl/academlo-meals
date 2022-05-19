const { Meal } = require('../models/meal.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

const mealExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
  });

  if (!meal) {
    return next(new AppError('Meal not found', 404));
  }

  req.meal = meal;
  next();
});

module.exports = { mealExists };
