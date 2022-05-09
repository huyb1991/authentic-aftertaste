// Routing
const { HomeController } = require('./home');
const { RecipeController } = require('./recipe');
const {
  ContactPage,
  AboutUsPage,
  TermOfUsePage,
  DisclaimerPage
} = require('./static');

module.exports.router = {
  HomeController,
  RecipeController,

  // Static pages
  ContactPage,
  AboutUsPage,
  TermOfUsePage,
  DisclaimerPage,
};
