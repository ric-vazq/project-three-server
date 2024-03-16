const Ingredient = require("../models/Ingredient.model");
const fileUploader = require("../config/cloudinary.config");

const express = require("express");
const router = express.Router();

router.get("/all-ingredients", async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find();
    console.log(ingredients);
    return res.status(200).json({ ingredients: ingredients });
  } catch (error) {
    next(error);
  }
});

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

// Create Ingredient
router.post("/create-ingredient", async (req, res, next) => {
  try {
    const { name, calories, proteins, fats, carbs, imageUrl } = req.body;
    // console.log(req.body);
    if (name === "" || imageUrl === "") {
      res.status(400).json({ message: "Name and Image are required fields!" });
    }
    const createdIngredient = await Ingredient.create(req.body);
    res.status(200).json(createdIngredient);
  } catch (error) {
    next(error);
  }
});

// Find Ingredient
router.get("/:ingredientId", async (req, res, next) => {
  try {
    const { ingredientId } = req.params;
    const foundIngredient = await Ingredient.findById(ingredientId);
    console.log("foundIngredient", foundIngredient);
    return res.status(200).json(foundIngredient);
  } catch (error) {
    next(error);
  }
});

router.put("/:ingredientId/edit", async (req, res, next) => {
  try {
    const { ingredientId } = req.params;
    const { name, calories, proteins, fats, carbs, imageUrl } = req.body;

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      ingredientId,
      req.body,
      { new: true }
    );
    console.log(updatedIngredient);
    return res.status(200).json(updatedIngredient);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
