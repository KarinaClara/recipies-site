const router = require("express").Router();
const mongoose = require("mongoose");

//middleware
const isLoggedIn = require("../middleware/isLoggedIn");

//cloudinary
const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');
const fileUploader = require('../config/cloudinary.config')



//DISPLAY LIST
router.get('/recipes', (req, res, next) => {
    Recipe.find()
        .then(allRecipes => {
            //console.log('ALL RECIPES HELLO ', allRecipes)
            res.render('recipe/recipes', { recipes: allRecipes })
        })
        .catch(error => {
            console.log('Error while getting the recipes: ', error)
            next(error)
        })

});

// CREATE
router.get('/recipe/create', isLoggedIn, (req, res, next) => {
    res.render("recipe/new-recipe")
})

router.post('/recipe/create', fileUploader.single('recipe-cover-image'), isLoggedIn, (req, res, next) => {
    const { author , title, content } = req.body; 
    //console.log('CONSOLE LOG REQ BODY: ', req.body.author)
     
    const imageURL = req.file.path 

    Recipe.create({ author, title, content, imageURL })
    .then((newRecipe) => {
        //console.log('THERE IS NEW REC', newRecipe)
        //console.log('AUTHOOOR', author)
        return User.findByIdAndUpdate(author, { $push: { recipes: newRecipe._id, newRecipe } });
      })
        .then((newRecipe)=> {
           // console.log('THERE IS NEW REC 2222', newRecipe)
            res.redirect('/recipes')
        })
        .catch(error => {
            console.log('Error while saving recipe', error)
            next(error)
          
        })
})

//EDIT & UPDATE

router.get('/recipe/:recipeId/edit', isLoggedIn, (req, res, next) => {
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

router.post('/recipe/:recipeId/edit', fileUploader.single('recipe-cover-image'), isLoggedIn, (req, res, next) => {
    const { recipeId } = req.params
    const {author, title, content } = req.body 

    //to display latest image if user doesn't upload any 
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
        res.redirect(`/recipe/${updatedRecipe._id}`)
      
    })
    .catch(error => {
        console.log('There was an error while updating data', error)
        next(error)
    })
})


          
//DETAILS PAGE
router.get('/recipe/:recipeId', (req, res, next)=> {
    const recipeId = req.params.recipeId

    Recipe.findById(recipeId)
    .populate('author')
    .then(recipeDetails => {
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