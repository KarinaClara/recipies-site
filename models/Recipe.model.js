const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const recipeSchema = new Schema(
{
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    title: { 
    type: String,
    unique: true
    },

    content: {
    type: String,
    },

    image: 
    {
    type: String,
    default: ''
    },

})

// FOR REVIEWS USE EMBEDDED STRUCTURE

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
