// BASE_URL = 'https://domain.com';
BASE_URL = 'http://localhost:5000';
BASE_URL_SITEMAP = 'https://domain.com';

const ENTITY = {
  BLOG: 'blog',
  SITEMAP: 'sitemap'
};

const CATEGORY_SLUG = {
  [ENTITY.BLOG]: '',
};

const MENUS = [];

module.exports = {
  BASE_URL,
  BASE_URL_SITEMAP,
  ENTITY,
  CATEGORY_SLUG,
  MENUS
};
