// Constants
const MODELS = require('../../models').models;
const { ENTITY, ENTITY_NAME } = require('../../constants');

// Helpers
const { getFlashMessage } = require('../../helpers');

const CuisineList = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const headers = [
    { name: 'Cuisine', field: 'name' },
    { name: 'Operator', field: '_' },
  ];

  return MODELS.cuisineGetAll()
    .then(data => {
      return res.render(
        'admin/list',
        {
          title: `List ${ENTITY_NAME[ENTITY.CUISINE]}`,
          entity: ENTITY.CUISINE,
          headers,
          data,
          ...flashMessage
        },
      );
    })
};

const CuisineDetail = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const { id } = req.params;

  // Create new Cuisine
  if (id === 'create') {
    return res.render(
      `admin/detail`,
      {
        title: `Create new ${ENTITY_NAME[ENTITY.CUISINE]}`,
        entity: ENTITY.CUISINE,
        data: {},
        ...flashMessage
      },
    );
  }

  return MODELS.cuisineGetDetailById(id)
    .then(data => {
      return res.render(
        `admin/detail`,
        {
          title: `Detail ${ENTITY_NAME[ENTITY.CUISINE]}`,
          entity: ENTITY.CUISINE,
          data,
          ...flashMessage
        },
      );
    });
};

const CuisineDetailUpdate = (req, res) => {
  const { id } = req.params;
  const cuisineId = req.body.id;
  const cuisineData = req.body;
  const actionAddMsg = `Create new ${ENTITY_NAME[ENTITY.CUISINE]}`;
  const actionUpdateMsg = `Update ${ENTITY_NAME[ENTITY.CUISINE]}`;

  // Create new Cuisine
  if (id === 'create') {
    return MODELS.cuisineAdd(cuisineData)
      .then(newId => {
        const message = encodeURIComponent(`${actionAddMsg} successfully - id: ${newId}.`);
        return res.redirect(`/admin/${ENTITY.CUISINE}/${newId}/?success=true&message=${message}`);
      })
      .catch(err => {
        console.log(`${actionAddMsg} error: ${err.message}`);
        const message = encodeURIComponent(`${actionAddMsg} error!!!`);

        return res.redirect(`/admin/${ENTITY.CUISINE}/?error=true&message=${message}`);
      });
  }

  return MODELS.cuisineUpdate(cuisineId, cuisineData)
    .then(() => {
      const message = encodeURIComponent(`${actionUpdateMsg} successfully - id: ${cuisineId}.`);
      return res.redirect(`/admin/${ENTITY.CUISINE}/${cuisineId}/?success=true&message=${message}`);
    })
    .catch(err => {
      console.log(`${actionUpdateMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionUpdateMsg } error!!!`);

      return res.redirect(`/admin/${ENTITY.CUISINE}/?error=true&message=${message}`);
    });
};

const CuisineDetailDelete = (req, res) => {
  const { id } = req.params;
  const actionAddMsg = `Delete ${ENTITY_NAME[ENTITY.CUISINE]}`;

  return MODELS.cuisineDelete(id)
    .then(() => {
      const message = encodeURIComponent(`${actionAddMsg} successfully!`);
      return res.redirect(`/admin/${ENTITY.CUISINE}/?success=true&message=${message}`);
    })
    .catch(err => {
      console.log(`${actionAddMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionAddMsg } error!!!`);

      return res.redirect(`/admin/${ENTITY.CUISINE}/?error=true&message=${message}`);
    });
};

module.exports = {
  CuisineList,
  CuisineDetail,
  CuisineDetailUpdate,
  CuisineDetailDelete,
};
