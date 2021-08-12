const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const saltRounds = 10;

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/user-profile", isLoggedIn, (req, res) => {
  const userId = req.session.user._id;

  User.findById(userId)
    .populate("recipes")
    .then((singleUserFromDb) => {
      res.render("user/user-profile", { user: singleUserFromDb });
    })
    .catch((err) => {
      console.log(`Error while getting user details: ${err}`);
      next(err);
    });
});

router.get("/user-profile/edit", isLoggedIn, (req, res, next) => {
  const userId = req.session.user._id;

  User.findById(userId)
    .then((userToEdit) => {
      res.render("user/edit-profile", { user: userToEdit });
    })
    .catch((error) => {
      console.log("There was an error while displaying user profile to edit", error);
      next(error);
    });
});

router.post("/user-profile/edit", isLoggedIn, (req, res, next) => {
  const userId = req.session.user._id;
  const { username, email } = req.body;

  if (!username || !email) {
    const missingFields = {
      username: !username,
      email: !email,
    };
    return res.status(400).render("user/signup", { errorMessage: "Please fill all fields", missingFields });
  }

  User.findByIdAndUpdate(userId, { username, email }, { new: true })
    .then((updatedUser) => {
      res.redirect("/user-profile");
    })
    .catch((error) => {
      console.log("There was an error while updating user data", error);
      next(error);
    });
});

router.post("/user-profile/delete", isLoggedIn, (req, res, next) => {
  const userId = req.session.user._id;
  User.findByIdAndDelete(userId)
    .then(() => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).render("user/login", { errorMessage: err.message });
        }
        res.redirect("/signup");
      });
    })
    .catch((error) => {
      console.log("Error while deleting user", error);
      next(error);
    });
});

router.get("/signup", isLoggedOut, (req, res) => {
  console.log("INSIDE GET ROUTE");
  res.render("user/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const missingFields = {
      username: !username,
      email: !email,
      password: !password,
    };
    return res.status(400).render("user/signup", { errorMessage: "Please fill all fields", missingFields });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    return res.status(400).render("user/signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  User.findOne({ username }).then((found) => {
    if (found) {
      return res.status(400).render("user/signup", { errorMessage: "Username already taken." });
    }

    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          email,
          passwordHash: hashedPassword,
        });
      })
      .then((user) => {
        req.session.user = user;
        res.redirect("/user-profile");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).render("user/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("user/signup", {
            errorMessage: "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res.status(500).render("user/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("user/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("user/login", { errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("user/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(400).render("user/login", { errorMessage: "Wrong credentials." });
      }

      bcrypt.compare(password, user.passwordHash).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("user/login", { errorMessage: "Wrong credentials." });
        }
        req.session.user = user;
        return res.redirect("/user-profile");
      });
    })

    .catch((err) => {
      next(err);
      return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("user/login", { errorMessage: err.message });
    }
    res.redirect("/login");
  });
});

module.exports = router;
