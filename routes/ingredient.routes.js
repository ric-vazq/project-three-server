const Ingredient = require('../models/Ingredient.model')

const express = require("express");
const router = express.Router();

router.get("/all-ingredients", async (req, res, next) => {});

// Create Ingredient
router.post("/create-ingredient", async (req, res, next) => {
  try {
    console.log(req.body);
    const createdIngredient = await Ingredient.create(req.body);
    res.status(200).json(createdIngredient)

  } catch (error) {
    next(error);
  }
});

module.exports = router;
