const { Schema, model } = require("mongoose");

const mealSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    imageUrl: {
      type: String,
    },
    ingredients: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Ingredient" },
        quantity: Number,
      },
    ],
    protein: Number,
    fats: Number,
    carbs: Number,
    cookingInstructions: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Meal = model("Meal", mealSchema);

module.exports = Meal;
