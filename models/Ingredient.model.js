const { Schema, model } = require("mongoose");

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    amount: {
      type: Number,
      default: 100,
    },
    calories: Number,
    protein: Number,
    fats: Number,
    carbs: Number,
  },
  {
    timestamps: true,
  }
);

const Ingredient = model("Ingredient", ingredientSchema);

module.exports = Ingredient;
