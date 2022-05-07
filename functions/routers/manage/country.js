// Constants
const MODELS = require('../../models').models;
const { ENTITY, ENTITY_NAME } = require('../../constants');

// Helpers
const { getFlashMessage } = require('../../helpers');

const CountryList = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const headers = [
    { name: 'Country', field: 'name' },
    { name: 'Operator', field: '_' },
  ];

  return MODELS.countryGetAll()
    .then(data => {
      return res.render(
        'admin/list',
        {
          title: `List ${ENTITY_NAME[ENTITY.COUNTRY]}`,
          entity: ENTITY.COUNTRY,
          headers,
          data,
          ...flashMessage
        },
      );
    })
};

const CountryDetail = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const { id } = req.params;

  // Create new Country
  if (id === 'create') {
    return res.render(
      `admin/detail`,
      {
        title: `Create new ${ENTITY_NAME[ENTITY.COUNTRY]}`,
        entity: ENTITY.COUNTRY,
        data: {},
        ...flashMessage
      },
    );
  }

  return MODELS.countryGetDetailById(id)
    .then(data => {
      return res.render(
        `admin/detail`,
        {
          title: `Detail ${ENTITY_NAME[ENTITY.COUNTRY]}`,
          entity: ENTITY.COUNTRY,
          data,
          ...flashMessage
        },
      );
    });
};

const CountryDetailUpdate = (req, res) => {
  const { id } = req.params;
  const countryId = req.body.id;
  const countryData = req.body;
  const actionAddMsg = `Create new ${ENTITY_NAME[ENTITY.COUNTRY]}`;
  const actionUpdateMsg = `Update ${ENTITY_NAME[ENTITY.COUNTRY]}`;

  // Create new Country
  if (id === 'create') {
    return MODELS.countryAdd(countryData)
      .then(newId => {
        const message = encodeURIComponent(`${actionAddMsg} successfully - id: ${newId}.`);
        return res.redirect(`/admin/${ENTITY.COUNTRY}/${newId}/?success=true&message=${message}`);
      })
      .catch(err => {
        console.log(`${actionAddMsg} error: ${err.message}`);
        const message = encodeURIComponent(`${actionAddMsg} error!!!`);

        return res.redirect(`/admin/${ENTITY.COUNTRY}/?error=true&message=${message}`);
      });
  }

  return MODELS.countryUpdate(countryId, countryData)
    .then(() => {
      const message = encodeURIComponent(`${actionUpdateMsg} successfully - id: ${countryId}.`);
      return res.redirect(`/admin/${ENTITY.COUNTRY}/${countryId}/?success=true&message=${message}`);
    })
    .catch(err => {
      console.log(`${actionUpdateMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionUpdateMsg } error!!!`);

      return res.redirect(`/admin/${ENTITY.COUNTRY}/?error=true&message=${message}`);
    });
};

const CountryDetailDelete = (req, res) => {
  const { id } = req.params;
  const actionAddMsg = `Delete ${ENTITY_NAME[ENTITY.COUNTRY]}`;

  return MODELS.countryDelete(id)
    .then(() => {
      const message = encodeURIComponent(`${actionAddMsg} successfully!`);
      return res.redirect(`/admin/${ENTITY.COUNTRY}/?success=true&message=${message}`);
    })
    .catch(err => {
      console.log(`${actionAddMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionAddMsg } error!!!`);

      return res.redirect(`/admin/${ENTITY.COUNTRY}/?error=true&message=${message}`);
    });
};

module.exports = {
  CountryList,
  CountryDetail,
  CountryDetailUpdate,
  CountryDetailDelete,
};
