const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

// GET Favorites
router.get("/:userId/favorite-meals", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const foundUser = await User.findById(userId).populate("favMeals");
    res.status(200).json({ favMeals: foundUser.favMeals });
  } catch (error) {
    next(error);
  }
});

router.get("/:userId/favorite-ingredients", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const foundUser = await User.findById(userId).populate("favIngredients");
    res.status(200).json({ favIngredients: foundUser.favIngredients });
  } catch (error) {
    next(error);
  }
});

// Add meals to favorites
router.post("/:userId/favorites/meals", async (req, res) => {
  const { userId } = req.params;
  const { mealId } = req.body;

  try {
    let user = await User.findById(userId);

    // Check if mealId already exists in favMeals
    if (!user.favMeals.includes(mealId)) {
      user.favMeals.push(mealId);
      await user.save();
      res.json({
        success: true,
        message: "Meal added to favorites successfully",
        meal: mealId,
      });
    } else {
      res.json({
        success: false,
        message: "Meal already exists in favorites",
        meal: mealId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Remove meals from favorites
router.delete("/:userId/favorites/meals/:mealId", async (req, res) => {
  const { userId, mealId } = req.params;

  try {
    let user = await User.findById(userId);

    // Check if mealId exists in favMeals
    if (user.favMeals.includes(mealId)) {
      user.favMeals = user.favMeals.filter((id) => id.toString() !== mealId);
      await user.save();
      res.json({
        success: true,
        message: "Meal removed from favorites successfully",
        meal: mealId,
      });
    } else {
      res.json({
        success: false,
        message: "Meal does not exist in favorites",
        meal: mealId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Add ingredients to favorites
router.post("/:userId/favorites/ingredients", async (req, res) => {
  const { userId } = req.params;
  const { ingredientId } = req.body;

  try {
    let user = await User.findById(userId);

    // Check if ingredientId already exists in favIngredients
    if (!user.favIngredients.includes(ingredientId)) {
      user.favIngredients.push(ingredientId);
      await user.save();
      res.json({
        success: true,
        message: "Ingredient added to favorites successfully",
        ingredient: ingredientId,
      });
    } else {
      res.json({
        success: false,
        message: "Ingredient already exists in favorites",
        ingredient: ingredientId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Remove ingredients from favorites
router.delete(
  "/:userId/favorites/ingredients/:ingredientId",
  async (req, res) => {
    const { userId, ingredientId } = req.params;

    try {
      let user = await User.findById(userId);

      // Check if ingredientId exists in favIngredients
      if (user.favIngredients.includes(ingredientId)) {
        user.favIngredients = user.favIngredients.filter(
          (id) => id.toString() !== ingredientId
        );
        await user.save();
        res.json({
          success: true,
          message: "Ingredient removed from favorites successfully",
          ingredient: ingredientId,
        });
      } else {
        res.json({
          success: false,
          message: "Ingredient does not exist in favorites",
          ingredient: ingredientId,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.post(
  "/image-upload",
  fileUploader.single("profilePic"),
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    res.json({ fileUrl: req.file.path });
  }
);

router.put("/:userId/edit-user", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
