// const mongoose = require("mongoose");
// // const User = require("../models/User.model");
// const Recipe = require("../models/Recipe.model");

// const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/recipies-site";

// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });


// // const users = require("./users-seed-data");
// const recipes = require("./recipes-seed-data");


// FOR MOC USER WE NEED TO ENCRYPT PASSWORD HERE

// // User.create(users)
// //   .then((usersFromDB) => {
// //     console.log(`Created ${usersFromDB.length} users`);

// //     // Once created, close the DB connection
// //     mongoose.connection.close();
// //   })
// //   .catch((err) => console.log(`An error occurred while uploading users to the DB: ${err}`));

// Recipe.create(recipes)
//   .then((recipesFromDB) => {
//     console.log(`Created ${recipesFromDB.length} recipes`);

//     // Once created, close the DB connection
//     mongoose.connection.close();
//   })
//   .catch((err) => console.log(`An error occurred while uploading recipes to the DB: ${err}`));
