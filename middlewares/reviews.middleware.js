const { Review } = require('../models/review.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');
const { User } = require('../models/user.model');

const reviewExists = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;

  const review = await Review.findOne({
    where: { restaurantId, id },
  });

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  req.review = review;

  next();
});

module.exports = { reviewExists };
