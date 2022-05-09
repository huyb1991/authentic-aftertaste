// Constant
const { PAGE_NAME } = require('./_constants');

// Helper
const CONTENT = require('../../content/_helpers');

const RecipeController = (req, res, isAMP = false) => {
  const { slug } = req.params;

  return CONTENT.readFileContent(CONTENT.FILE_NAME.RECIPE_DETAIL(slug))
    .then(recipe => {
      return res.render(
        `client${isAMP ? '/amp' : ''}/recipe`,
        {
          pageName: PAGE_NAME.RECIPE,
          recipe,
        },
      );
    });
};


module.exports = {
  RecipeController,
};
