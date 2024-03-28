# Server

## Models

User model

```javascript
{
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    firstName: {
      type: String,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
    },
    profilePic: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg",
    },
    favMeals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
    favIngredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    confirmationCode: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending Confirmation", "Active"],
      default: "Pending Confirmation",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
}
```

Meal model

```javascript
{
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
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
    proteins: Number,
    fats: Number,
    carbs: Number,
    calories: Number,
    cookingInstructions: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
}
```

Ingredient model

```javascript
{
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required."],
    },
    amount: {
      type: Number,
      default: 100,
    },
    calories: Number,
    proteins: Number,
    fats: Number,
    carbs: Number,
}
```

## API Endpoints (backend routes)

| HTTP Method | URL                                                 | Request Body                                       | Success status | Error Status | Description                                                                                                         |
| ----------- | --------------------------------------------------- | -------------------------------------------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| GET         | `/auth/profile    `                                 | Saved session                                      | 200            | 404          | Check if user is logged in and return profile page                                                                  |
| POST        | `/auth/signup`                                      | {email, password, passVerify, firstName, lastName} | 200            | 404          | Checks if fields not empty and user not exists, then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                                       | {email, password}                                  | 200            | 401          | Checks if fields not empty (400), if user exists (401), and if password matches (401), then stores user in session  |
| POST        | `/auth/logout`                                      | (empty)                                            | 200            | 400          | Logs out the user                                                                                                   |
| GET         | `/auth/verify`                                      |                                                    | 200            | 400          | Verify JWT stored on the client                                                                                     |
| GET         | `/confirm/:confirmationCode`                        |                                                    |                | 401          | To accept user confirmation email                                                                                   |
| POST        | `/contact/send-email`                               |                                                    | 200            | 400          | Send an email through the contact form                                                                              |
| GET         | `/ingredient/allingredients`                        |                                                    | 200            | 400          | Show ingredients                                                                                                    |
| POST        | `/ingredient/image-upload`                          |                                                    | 200            | 400          | To add an image                                                                                                     |
| POST        | `/ingredient/create-ingredient`                     |                                                    | 200            | 400          | To add an ingredient                                                                                                |
| GET         | `/ingredient/:ingredientId`                         |                                                    | 201            | 400          | Show specific ingredient                                                                                            |
| PUT         | `/ingredient/:ingredientId/edit`                    |                                                    | 200            | 400          | edit ingredient                                                                                                     |
| DELETE      | `/ingredient/:ingredientId/delete`                  |                                                    | 201            | 400          | delete ingredient                                                                                                   |
| GET         | `/meal/meals-by-ingredient/ingredientId`            |                                                    | 200            | 400          | Show meals by ingredient                                                                                            |
| GET         | `/meal/allMeals`                                    |                                                    | 200            | 400          | Show meals                                                                                                          |
| POST        | `/meal/image-upload`                                |                                                    | 200            | 400          | To add an image                                                                                                     |
| POST        | `/meal/create-meal`                                 |                                                    | 200            | 400          | To add a meal                                                                                                       |
| GET         | `/meal/:mealId`                                     |                                                    | 201            | 400          | To show specific meal                                                                                               |
| PUT         | `/meal/:mealId/edit`                                |                                                    | 200            | 400          | To edit meal                                                                                                        |
| DELETE      | `/meal/:mealId/delete`                              |                                                    | 201            | 400          | To delete meal                                                                                                      |
| GET         | `/user/:userId/favorite-meals`                      |                                                    | 200            | 400          | To show user's favorite meals                                                                                       |
| GET         | `/user/:userId/favorite-ingredients`                |                                                    | 200            | 400          | To show user's favorite ingredients                                                                                 |
| POST        | `/user/:userId/favorites/meals`                     |                                                    | 200            | 400          | To add meals to user's favorite list                                                                                |
| DELETE      | `/user/:userId/favorites/meals/:mealId`             |                                                    | 200            | 400          | To remove meal from user's favorite list                                                                            |
| POST        | `/user/:userId/favorites/ingredients`               |                                                    | 200            | 400          | To add meals to user's favorite list                                                                                |
| DELETE      | `/user/:userId/favorites/ingredients/:ingredientId` |                                                    | 200            | 400          | To remove ingredient to user's favorite list                                                                        |
| POST        | `/user/image-upload`                                |                                                    | 201            | 400          | To add an image                                                                                                     |
| PUT         | `/user/:userId/edit`                                |                                                    | 200            | 400          | edit user                                                                                                           |

<br>

## Links

### Mockups

![mockup-1](https://github.com/Bricebrice/project-three-client/blob/main/src/assets/mockup-1.png)
![mockup-2](https://github.com/Bricebrice/project-three-client/blob/main/src/assets/mockup-2.png)
![mockup-3](https://github.com/Bricebrice/project-three-client/blob/main/src/assets/mockup-3.png)

### Git

[Client repository Link](https://github.com/Bricebrice/project-three-client)
[Server repository Link](https://github.com/ric-vazq/project-three-server)

[Deploy Link](https://veganease-planner.netlify.app/)

### Slides

[Presentation Link](https://docs.google.com/presentation/d/e/2PACX-1vRVJDDhyWizPdTpW_xgi5nhvnGFBj9RykIHASbVLKGKLsb4vNjjKkOipla8cPv9k_XkaJ5LBZmodeFy/pub?start=false&loop=false&delayms=3000)
