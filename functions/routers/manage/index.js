// Routers
const {
  CuisineList,
  CuisineDetail,
  CuisineDetailUpdate,
  CuisineDetailDelete,
} = require('./cuisine');
const {
  RecipeList,
  RecipeDetail,
  RecipeDetailUpdate,
  RecipeDetailDelete,
} = require('./recipe');

module.exports.router = {
  CuisineList,
  CuisineDetail,
  CuisineDetailUpdate,
  CuisineDetailDelete,
  RecipeList,
  RecipeDetail,
  RecipeDetailUpdate,
  RecipeDetailDelete,
};
