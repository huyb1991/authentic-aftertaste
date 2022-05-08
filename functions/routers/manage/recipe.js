// Constants
const MODELS = require('../../models').models;
const { ENTITY, ENTITY_NAME } = require('../../constants');

// Helpers
const { getFlashMessage } = require('../../helpers');
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
    return res.render(
      `admin/${ENTITY.RECIPE}/detail`,
      {
        title: `Create new ${ENTITY_NAME[ENTITY.RECIPE]}`,
        entity: ENTITY.RECIPE,
        data: {},
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
    slug,
    prevSlug,
    ...rest
  } = req.body;
  const submitIngredients = ingredients.filter(it => it.ingredient);
  const submitDirections = directions.filter(it => it.desc);
  const recipeData = {
    ...rest,
    slug,
    ingredients: submitIngredients,
    directions: submitDirections,
  };
  // TODO: Update ordering

  // Create new Recipe
  if (id === 'create') {
    // Set 5 star rating for new recipe
    recipeData[rating] = [0, 0, 0, 0, 1];

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
