# VeganEase Planner

## Description

VeganEase Planner simplifies meal planning by allowing users to create and save vegan meals with community-contributed ingredients. A future calendar feature planned.

## User Stories

- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
- **Signup:** As an anon I can sign up in the platform so that I can start saving favorite restaurants
- **Login:** As a user I can login to the platform so that I can see my favorite restaurants
- **Logout:** As a user I can logout from the platform so no one else can use it
- **Add Meals** As a user I can add a restaurant so that I can share it with the community
- **Add Ingredients to Meals** As a user I want to create meals using available ingredients so so that I can share it with the community
- **List Meals** As a user I want to see the restaurants so that I can choose one to eat
- **Edit Meals** As a meal author I can edit a meal so that I can be as accurate as possible
- **Delete Meals** As a meal author I can delete a meal so that it's no longer available
- **Add Ingredients** As an admin I can add a restaurant so that I can share it with the community
- **List Ingredients** As a user I want to see the restaurants so that I can choose one to eat
- **Edit Ingredients** As an admin I can edit an ingredient so that I can be as accurate as possible
- **Delete Ingredients** As an admin I can delete an ingredient so that it's no longer available
- **Add meals/ingredients to favorites** As a user I want to add a restaurant to favorite so that I can save the restaurants that I liked the most
- **See my favorites** As a user I want to see my favorite restaurantes so that I can see the ones I liked the most
- **Contact form** As a user I want to send an email to VeganEase Planner authors so that I can contact them
- **Profile Page** As a user I can edit my user so that I have an unique profile
- **Roles** As a moderator I can choose who is a "user" or "admin" so that I can handle the authorizations

## Backlog

Dark mode:

- see the whole app in dark mode

Calendar:

- add meals to a calendar

Drag and drop:

- meals to calendar

Comments:

- add comments to meals

Search Meals:

- Search by name or ingredient

Social media authentication:

- Google / Twitter

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
