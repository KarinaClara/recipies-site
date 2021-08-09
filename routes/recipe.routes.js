const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

const Recipe = require("../models/Recipe.model");

router.get('/recipes', (req, res, next) => {
    //console.log( 'HELLO HELLO HELLO ')
    Recipe.find()
      .then(allRecipes => {
          console.log( 'ALL RECIPES HELLO ', allRecipes)
        res.render('recipe/recipes', { recipes: allRecipes })
      })
      .catch(error => {
        console.log('Error while getting the recipes: ', error)
        next(error)
      })
  
  });
  

router.get('/recipe/create', (req, res, next) => {
    res.render("recipe/new-recipe")
})

router.post('/recipe/create', (req, res, next) => {
    const { author, title, content, image } = req.body;

          Recipe.create({ author, title, content, image })
          .then(addRecipe => {
              console.log('new recipe created')

            res.redirect('/recipes')
          })

          .catch(error => {
            res.redirect('/recipe/new-recipe', error)
            next(error)
          })
        
})


/*
          if (isLoggedIn === true) {
              res.redirect('/recipe/create')
          }
          else {
              res.redirect ('/signup')
          }
          */



module.exports = router;