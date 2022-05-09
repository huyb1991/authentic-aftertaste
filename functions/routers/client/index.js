// Routing
const { HomeController } = require('./home');
const { RecipeDetailController } = require('./recipe');
const {
  ContactPage,
  AboutUsPage,
  TermOfUsePage,
  DisclaimerPage
} = require('./static');

module.exports.router = {
  HomeController,
  RecipeDetailController,

  // Static pages
  ContactPage,
  AboutUsPage,
  TermOfUsePage,
  DisclaimerPage,
};
