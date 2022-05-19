const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({ name, address, rating });

  res.status(201).json({
    status: 'New restaurant created',
    newRestaurant,
  });
});

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'active' },
    include: [
      { model: Review, attributes: ['id', 'comment', 'rating', 'userId'] },
    ],
  });

  res.status(200).json({
    status: 'All restaurants retrieved',
    restaurants,
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
    include: [
      { model: Review, attributes: ['id', 'comment', 'rating', 'userId'] },
    ],
  });

  res.status(200).json({
    status: 'Restaurant retrieved',
    restaurant,
  });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  const { name, address } = req.body;

  await restaurant.update({ name, address });

  res.status(200).json({
    status: 'Restaurant updated',
    restaurant,
  });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'deleted' });

  res.status(200).json({
    status: 'Restaurant deleted',
    restaurant,
  });
});

const createRestaurantReview = catchAsync(async (req, res, next) => {
  const { sessionUser, restaurant } = req;

  const { rating, comment } = req.body;

  const newReview = await Review.create({
    comment,
    rating,
    restaurantId: restaurant.id,
    userId: sessionUser.id,
  });

  await restaurant.addReview(newReview);

  res.status(201).json({
    status: 'New review created',
    newReview,
  });
});

const updateRestaurantReview = catchAsync(async (req, res, next) => {
  const { sessionUser, review } = req;

  const { rating, comment } = req.body;

  if (sessionUser.id !== review.userId) {
    return next(new AppError('You can only update your own reviews', 403));
  } else {
    await review.update({ comment, rating });
  }

  res.status(200).json({
    status: 'Review updated',
    review,
  });
});

const deleteRestaurantReview = catchAsync(async (req, res, next) => {
  const { sessionUser, review } = req;

  if (sessionUser.id !== review.userId) {
    return next(new AppError('You can only delete your own reviews', 403));
  } else {
    await Review.destroy({ where: { id: review.id } });
  }

  res.status(200).json({
    status: 'Review deleted',
  });
});

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
};
