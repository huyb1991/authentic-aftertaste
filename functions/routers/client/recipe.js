// Constant
const { PAGE_NAME } = require('./_constants');

// Helper
const { render404Page } = require('../../helpers');
const CONTENT = require('../../content/_helpers');

const RecipeDetailController = (req, res, isAMP = false) => {
  const { slug } = req.params;

  return CONTENT.readFileContent(CONTENT.FILE_NAME.RECIPE_DETAIL(slug))
    .then(recipe => {
      if (!recipe) {
        return render404Page(res);
      }

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
  RecipeDetailController,
};
