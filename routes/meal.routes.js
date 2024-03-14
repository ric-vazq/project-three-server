const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Meal = require("../models/Meal.model");

// GET all Meals
router.get("/all-meals", async (req, res, next) => {
  try {
    const meals = await Meal.find().populate("ingredients");
    return res.status(200).json({ meals: meals });
  } catch (error) {
    next(error);
  }
});

//POST Image Upload
router.post(
  "/image-upload",
  fileUploader.single("imageUrl"),
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    res.json({ fileUrl: req.file.path });
  }
);

//POST Create new Meal
router.post("/create-new-meal", async (req, res, next) => {
  try {
    const {
      name,
      image,
      protein,
      fats,
      carbs,
      cookingInstructions,
      description,
      creator,
    } = req.body;

    const newMeal = await Meal.create(req.body);
    return res.status(200).json(newMeal);
  } catch (error) {
    next(error);
  }
});

router.get("/:mealId", async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const foundMeal = await Meal.findById(mealId).populate("ingredients");
    if (!foundMeal) {
      res.status(400).json({ message: "The desired meal could not be found." });
      return;
    }
    return res.status(200).json(foundMeal);
  } catch (error) {
    next(error);
  }
});

router.put("/:mealId/edit", (req, res, next) => {
  console.log(req.body);
});

module.exports = router;
