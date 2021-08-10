const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

const Recipe = require("../models/Recipe.model");

//DISPLAY LIST
router.get('/recipes', (req, res, next) => {
    Recipe.find()
        .then(allRecipes => {
            console.log('ALL RECIPES HELLO ', allRecipes)
            res.render('recipe/recipes', { recipes: allRecipes })
        })
        .catch(error => {
            console.log('Error while getting the recipes: ', error)
            next(error)
        })

});

// CREATE
router.get('/recipe/create', (req, res, next) => {
    res.render("recipe/new-recipe")
})

router.post('/recipe/create', (req, res, next) => {
    const { author, title, content, image } = req.body;

    Recipe.create({ author, title, content, image })
        .then(addRecipe => {
            console.log('NEW BOOK CREATED', addRecipe)
            res.redirect('/recipes')
        })
        .catch(error => {
            console.log('Error while saving recipe', error)
            next(error)
          
        })
})

//EDIT & UPDATE

router.get('/recipe/:recipeId/edit', (req, res, next) => {
    const recipeId = req.params.recipeId

    Recipe.findById(recipeId)
        .then(recipeToEdit => {
            res.render('recipe/recipe-edit', { recipe: recipeToEdit })
        })
        .catch(error => {
            console.log('There was an error while updating data', error)
            next(error)
        })
})

router.post('/recipe/:recipeId/edit', (req, res, next) => {
    const { recipeId } = req.params.recipeId
    const {author, title, content, image } = req.body
    Recipe.findByIdAndUpdate(recipeId, { author, title, content, image }, {new:true})
    .then(updatedRecipe => {
        res.redirect(`/recipe/${updatedRecipe._id}`)
    })
    .catch(error => {
        console.log('There was an error while updating data', error)
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

          
//DETAILS PAGE
router.get('/recipe/:recipeId', (req, res, next)=> {
    const recipeId = req.params.recipeId
    Recipe.findById(recipeId)
    .then(recipeDetails => {
        res.render('recipe/recipe-details', {recipe: recipeDetails})
    })
    .catch(error => {
        console.log('There was an error while displaying the details', error)
        next(error)
    })
})

module.exports = router;