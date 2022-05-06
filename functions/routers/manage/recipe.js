// Constants
const MODELS = require('../../models').models;
const { ENTITY, ENTITY_NAME } = require('../../constants');

// Helpers
const { getFlashMessage } = require('../../helpers');

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
  const recipeData = req.body;
  const actionAddMsg = `Create new ${ENTITY_NAME[ENTITY.RECIPE]}`;
  const actionUpdateMsg = `Update ${ENTITY_NAME[ENTITY.RECIPE]}`;

  // Create new Recipe
  if (id === 'create') {
    return MODELS.recipeAdd(recipeData)
      .then(newId => {
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
