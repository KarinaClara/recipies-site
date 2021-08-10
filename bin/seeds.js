const mongoose = require("mongoose");
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/recipies-site";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const users = require("./users-seed-data");
const recipes = require("./recipes-seed-data");

function createUsers(users) {
  const saltRounds = 10;

  const { username, email, password } = users[0];

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((usersFromDb) => {
      console.log("Created 1 default user");
      mongoose.connection.close();
    })
    .catch((err) => console.log(`An error occurred while creating users in the DB: ${err}`));
}
Recipe.create(recipes)
  .then((recipesFromDB) => {
    console.log(`Created ${recipesFromDB.length} recipes`);

    mongoose.connection.close();
  })
  .catch((err) => console.log(`An error occurred while uploading recipes to the DB: ${err}`));

createUsers(users);
