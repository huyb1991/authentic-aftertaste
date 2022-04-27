// Routing
const { HomeController } = require('./home');
const {
  ContactPage,
  AboutUsPage,
  TermOfUsePage,
  DisclaimerPage
} = require('./static');

module.exports.router = {
  HomeController,

  // Static pages
  ContactPage,
  AboutUsPage,
  TermOfUsePage,
  DisclaimerPage,
};
