// Constant
const { PAGE_NAME } = require('./_constants');

// Helper
const CONTENT = require('../../content/_helpers');

const HomeController = (req, res, isAMP = false) => {
  return CONTENT.readFileContent(CONTENT.FILE_NAME.RECIPE_LATEST)
    .then(latestRecipe => {
      return res.render(
        `client${isAMP ? '/amp' : ''}/home`,
        {
          isHomePage: true,
          pageName: PAGE_NAME.HOME,
          recipes: latestRecipe,
        },
      );
    });
};


module.exports = {
  HomeController
};
