const Recipe = require("../models/Recipe.model");

module.exports = (req, res, next) => {

    Recipe.findById(req.params.recipeId)
        .then(recipe => {
            if (req.session.user._id == recipe.author) {
                res.locals.isTheAuthor = true;
            }
            next()
        })

  };