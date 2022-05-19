const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

const { catchAsync } = require('../utils/catchAsync');

const createMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const meal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({
    status: 'New meal successfully created',
    meal,
  });
});

const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: { status: 'active' },
    include: [{ model: Restaurant, attributes: ['id', 'name', 'address'] }],
  });

  res.status(200).json({
    status: 'Success',
    meals,
  });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
    include: [{ model: Restaurant, attributes: ['id', 'name', 'address'] }],
  });

  res.status(200).json({
    status: 'Success',
    meal,
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({ name, price });

  res.status(200).json({
    status: 'Meal was successfully updated',
    meal,
  });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'deleted' });

  res.status(200).json({
    status: 'Meal was successfully deleted',
    meal,
  });
});

module.exports = {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
};
