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

const RECIPE_CATEGORY = [
  { name: 'Breakfast (bữa sáng)', slug: 'breakfast' },
  { name: 'Lunch (bữa trưa)', slug: 'lunch' },
  { name: 'Dinner (bữa tối)', slug: 'dinner' },
  { name: 'Appetizer (khai vị)', slug: 'appetizer' },
  { name: 'Salad', slug: 'salad' },
  { name: 'Main-course (món chính)', slug: 'main-course' },
  { name: 'Side-dish (món phụ)', slug: 'side-dish' },
  { name: 'Baked-goods (đồ nướng)', slug: 'baked-goods' },
  { name: 'Dessert (tráng miệng)', slug: 'dessert' },
  { name: 'Snack (qua loa)', slug: 'snack' },
  { name: 'Soup (canh)', slug: 'soup' },
  { name: 'Holiday (ngày lễ)', slug: 'holiday' },
  { name: 'Vegetarian (món chay)', slug: 'vegetarian' },
];

module.exports = {
  BASE_URL,
  BASE_URL_ADMIN,
  BASE_URL_SITEMAP,
  ENTITY,
  ENTITY_NAME,
  CATEGORY_SLUG,
  RATING_SCORE,
  RECIPE_CATEGORY,
};
