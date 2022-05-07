BASE_URL = 'https://authenticaftertaste.com';
BASE_URL_ADMIN = 'http://localhost:5000';
BASE_URL_SITEMAP = 'https://authenticaftertaste.com';

const ENTITY = {
  COUNTRY: 'country',
  RECIPE: 'recipe',
  BLOG: 'blog',
  SITEMAP: 'sitemap'
};

const ENTITY_NAME = {
  [ENTITY.COUNTRY]: 'Country',
  [ENTITY.RECIPE]: 'Recipe',
};

const CATEGORY_SLUG = {
  [ENTITY.BLOG]: '',
};

module.exports = {
  BASE_URL,
  BASE_URL_ADMIN,
  BASE_URL_SITEMAP,
  ENTITY,
  ENTITY_NAME,
  CATEGORY_SLUG,
};
