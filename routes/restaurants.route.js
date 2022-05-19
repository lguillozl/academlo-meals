const express = require('express');

const {
  protectAccountOwner,
  protectAdmin,
  protectToken,
} = require('../middlewares/users.middleware');
const { restaurantExists } = require('../middlewares/restaurants.middleware');
const { reviewExists } = require('../middlewares/reviews.middleware');
const {
  createRestaurantValidations,
  checkValidations,
} = require('../middlewares/validations.middleware');

const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
} = require('../controllers/restaurants.controller');

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', restaurantExists, getRestaurantById);

router.use(protectToken);

router.post(
  '/',
  protectAdmin,
  createRestaurantValidations,
  checkValidations,
  createRestaurant
);
router.patch('/:id', protectAdmin, restaurantExists, updateRestaurant);
router.delete('/:id', protectAdmin, restaurantExists, deleteRestaurant);
router.post('/reviews/:id', restaurantExists, createRestaurantReview);
router.patch(
  '/reviews/:restaurantId/:id',
  reviewExists,
  updateRestaurantReview
);
router.delete(
  '/reviews/:restaurantId/:id',
  reviewExists,
  deleteRestaurantReview
);

module.exports = { restaurantsRouter: router };
