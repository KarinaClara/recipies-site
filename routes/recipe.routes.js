const router = require("express").Router();
const mongoose = require("mongoose");

//middleware
const isLoggedIn = require("../middleware/isLoggedIn");

//cloudinary
const Recipe = require('../models/Recipe.model');
const fileUploader = require('../config/cloudinary.config')



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

router.post('/recipe/create', fileUploader.single('recipe-cover-image'), (req, res, next) => {
    const { author, title, content } = req.body; //deleted image from object
     
    const imageURL = req.file.path 

    Recipe.create({ author, title, content, imageURL }) //deleted img
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

router.post('/recipe/:recipeId/edit', fileUploader.single('recipe-cover-image'), (req, res, next) => {
    const { recipeId } = req.params
    const {author, title, content } = req.body //deleted image property

    //to display latest image if user doesn't upload any when editing
    const recipeData = { 
        author,
        title, 
        content, 
    }

    if (req.file){
        recipeData.imageURL= req.file.path
    }

    Recipe.findByIdAndUpdate(recipeId, recipeData, {new:true})
    .then(updatedRecipe => {
        console.log('UPDATED RECCC', updatedRecipe)
        res.redirect(`/recipe/${updatedRecipe._id}`)
      
    })
    .catch(error => {
        console.log('There was an error while updating data', error)
        next(error)
    })
})


          
//DETAILS PAGE
router.get('/recipe/:recipeId', isLoggedIn, (req, res, next)=> {
    const recipeId = req.params.recipeId
    Recipe.findById(recipeId)
    .then(recipeDetails => {
        console.log('RECIPE RECIPE', recipeDetails )
        res.render('recipe/recipe-details', {recipe: recipeDetails})
    })
    .catch(error => {
        console.log('There was an error while displaying the details', error)
        next(error)
    })
})
// DELETE
router.post('/recipe/:recipeId/delete', isLoggedIn, (req, res, next) => {
    const {recipeId} = req.params
    Recipe.findByIdAndDelete(recipeId)
    .then( () => {
        res.redirect('/recipes')
    })
    .catch(error => {
        console.log('Error while deleting recipe', error)
        next(error)
        
    })

})

module.exports = router;