// Constants
const MODELS = require('../../models').models;
const {
  ENTITY,
  ENTITY_NAME,
  DEFAULT_CHEFS,
  RATING_SCORE,
} = require('../../constants');

// Helpers
const { getFlashMessage, getRandomNumber } = require('../../helpers');
const { AutoUpdateRecipeContent } = require('./_helpers');
const CONTENT = require('../../content/_helpers');

const RecipeList = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const headers = [
    { name: 'Recipe Name', field: 'name' },
    { name: 'Operator', field: '_' },
  ];

  return MODELS.recipeGetAll()
    .then(data => {
      return res.render(
        'admin/list',
        {
          title: `List ${ENTITY_NAME[ENTITY.RECIPE]}`,
          entity: ENTITY.RECIPE,
          headers,
          data,
          ...flashMessage
        },
      );
    })
};

const RecipeDetail = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const { id } = req.params;

  // Create new Recipe
  if (id === 'create') {
    const randomIndex = getRandomNumber(0, DEFAULT_CHEFS.length);
    const randomAuthor = DEFAULT_CHEFS[randomIndex];

    return res.render(
      `admin/${ENTITY.RECIPE}/detail`,
      {
        title: `Create new ${ENTITY_NAME[ENTITY.RECIPE]}`,
        entity: ENTITY.RECIPE,
        data: {
          author: randomAuthor,
          time: {},
        },
        ...flashMessage
      },
    );
  }

  return MODELS.recipeGetDetailById(id)
    .then(data => {
      return res.render(
        `admin/${ENTITY.RECIPE}/detail`,
        {
          title: `Detail ${ENTITY_NAME[ENTITY.RECIPE]}`,
          entity: ENTITY.RECIPE,
          data,
          ...flashMessage
        },
      );
    });
};

const RecipeDetailUpdate = (req, res) => {
  const { id } = req.params;
  const recipeId = req.body.id;
  const actionAddMsg = `Create new ${ENTITY_NAME[ENTITY.RECIPE]}`;
  const actionUpdateMsg = `Update ${ENTITY_NAME[ENTITY.RECIPE]}`;

  // Format and validation data
  const {
    ingredients = [],
    directions = [],
    ratings,
    slug,
    prevSlug,
    timePrep,
    timeCook,
    timeAdditional,
    ...rest
  } = req.body;
  const submitIngredients = ingredients.filter(it => it.ingredient);
  const submitDirections = directions.filter(it => it.desc);
  const ratingArr = ratings.map(it => Number(it));
  const recipeData = {
    ...rest,
    slug,
    ingredients: submitIngredients,
    directions: submitDirections,
    ratings: ratingArr,
    time: {
      prep: Number(timePrep || 0),
      cook: Number(timeCook || 0),
      additional: Number(timeAdditional || 0),
    }
  };
  // TODO: Update ordering

  // Create new Recipe
  if (id === 'create') {
    // Set 4 or 5 star rating for new Recipe
    const radomRatingValue = getRandomNumber(RATING_SCORE.MAX - 1, RATING_SCORE.MAX);
    if (radomRatingValue === 4) {
      recipeData[ratings] = [0, 0, 0, 1, 0];
    } else {
      recipeData[ratings] = [0, 0, 0, 0, 1];
    }

    return MODELS.recipeAdd(recipeData)
      .then(newId => {
        AutoUpdateRecipeContent(newId, slug, prevSlug);
        const message = encodeURIComponent(`${actionAddMsg} successfully - id: ${newId}.`);
        return res.redirect(`/admin/${ENTITY.RECIPE}/${newId}/?success=true&message=${message}`);
      })
      .catch(err => {
        console.log(`${actionAddMsg} error: ${err.message}`);
        const message = encodeURIComponent(`${actionAddMsg} error!!!`);

        return res.redirect(`/admin/${ENTITY.RECIPE}/?error=true&message=${message}`);
      });
  }

  return MODELS.recipeUpdate(recipeId, recipeData)
    .then(() => {
      // Change slug: Remove old file content
      if (prevSlug.trim() && slug.trim() !== prevSlug.trim()) {
        const fileName = `${ENTITY.RECIPE}/${prevSlug}`;
        CONTENT.removeFileContent(fileName);
      }

      AutoUpdateRecipeContent(recipeId, slug, prevSlug);
      const message = encodeURIComponent(`${actionUpdateMsg} successfully - id: ${recipeId}.`);
      return res.redirect(`/admin/${ENTITY.RECIPE}/${recipeId}/?success=true&message=${message}`);
    })
    .catch(err => {
      console.log(`${actionUpdateMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionUpdateMsg } error!!!`);

      return res.redirect(`/admin/${ENTITY.RECIPE}/?error=true&message=${message}`);
    });
};

const RecipeDetailDelete = (req, res) => {
  const { id } = req.params;
  const actionAddMsg = `Delete ${ENTITY_NAME[ENTITY.RECIPE]}`;

  return MODELS.recipeDelete(id)
    .then(() => {
      const message = encodeURIComponent(`${actionAddMsg} successfully!`);
      return res.redirect(`/admin/${ENTITY.RECIPE}/?success=true&message=${message}`);
    })
    .catch(err => {
      console.log(`${actionAddMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionAddMsg } error!!!`);

      return res.redirect(`/admin/${ENTITY.RECIPE}/?error=true&message=${message}`);
    });
};

module.exports = {
  RecipeList,
  RecipeDetail,
  RecipeDetailUpdate,
  RecipeDetailDelete,
};
