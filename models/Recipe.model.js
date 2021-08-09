const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const recipeSchema = new Schema(
{
    user: {
        username: {
            type: String,
            trim: true, //remove blank spaces 
            required: [true, 'Username is required.'],
            unique: true
          },
    },

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

    reviews: [String]

})

   



const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
