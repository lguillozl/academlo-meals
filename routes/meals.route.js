const express = require('express');

const { mealExists } = require('../middlewares/meals.middleware');
const {
  createMealValidations,
  checkValidations,
} = require('../middlewares/validations.middleware');
const {
  protectAdmin,
  protectToken,
} = require('../middlewares/users.middleware');

const {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controller');

const router = express.Router();

router.get('/', getAllMeals);
router.get('/:id', mealExists, getMealById);

router.use(protectToken);

router.post(
  '/:id',
  protectAdmin,
  createMealValidations,
  checkValidations,
  createMeal
);
router.patch('/:id', protectAdmin, mealExists, updateMeal);
router.delete('/:id', protectAdmin, mealExists, deleteMeal);

module.exports = { mealsRouter: router };
