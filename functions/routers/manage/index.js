// Routers
const {
  CountryList,
  CountryDetail,
  CountryDetailUpdate,
  CountryDetailDelete,
} = require('./country');
const {
  RecipeList,
  RecipeDetail,
  RecipeDetailUpdate,
  RecipeDetailDelete,
} = require('./recipe');

module.exports.router = {
  CountryList,
  CountryDetail,
  CountryDetailUpdate,
  CountryDetailDelete,
  RecipeList,
  RecipeDetail,
  RecipeDetailUpdate,
  RecipeDetailDelete,
};
