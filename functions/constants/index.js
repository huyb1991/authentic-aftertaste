BASE_URL = 'https://authenticaftertaste.com';
BASE_URL_ADMIN = 'http://localhost:5000';
BASE_URL_SITEMAP = 'https://authenticaftertaste.com';

const ENTITY = {
  CUISINE: 'cuisine',
  RECIPE: 'recipe',
  BLOG: 'blog',
  SITEMAP: 'sitemap'
};

const ENTITY_NAME = {
  [ENTITY.CUISINE]: 'Cuisine',
  [ENTITY.RECIPE]: 'Recipe',
};

const CATEGORY_SLUG = {
  [ENTITY.BLOG]: '',
  [ENTITY.RECIPE]: 'recipe',
};

const RATING_SCORE = {
  MIN: 1,
  MAX: 5,
};

const DEFAULT_CHEFS = [
  'Jennifer Miller',
  'Richard Williams',
  'Susan Jones',
  'Michael Brown',
  'Patricia Miller',
  'Robert Wilson',
];

module.exports = {
  BASE_URL,
  BASE_URL_ADMIN,
  BASE_URL_SITEMAP,
  ENTITY,
  ENTITY_NAME,
  CATEGORY_SLUG,
  RATING_SCORE,
  DEFAULT_CHEFS,
};
