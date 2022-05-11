const { ENTITY } = require('../constants');

const {
  getDocument,
  getCollectionOrderingWithConditions,
  getDocumentWithConditions,
  addDocument,
  updateDocument,
  deleteDocument,
} = require('./helper');

// Format document
const {
  formatDocumentBase,
  formatDocumentBlog
} = require('./format');

// CUISINE
const cuisineGetAll = (conditions = [], limit = 0) =>
  getCollectionOrderingWithConditions(ENTITY.CUISINE, 'name', conditions, limit);
const cuisineGetDetailById = id => getDocument(`${ENTITY.CUISINE}/${id}`);
const cuisineAdd = data => addDocument(ENTITY.CUISINE, formatDocumentBase(data));
const cuisineUpdate = (id, data) => updateDocument(`${ENTITY.CUISINE}/${id}`, formatDocumentBase(data));
const cuisineDelete = id => deleteDocument(ENTITY.CUISINE, id);

// RECIPE
const recipeGetAll = (conditions = [], limit = 0, orderBy = 'created') =>
  getCollectionOrderingWithConditions(ENTITY.RECIPE, orderBy, conditions, limit);
const recipeGetDetailById = id => getDocument(`${ENTITY.RECIPE}/${id}`);
const recipeAdd = data => addDocument(ENTITY.RECIPE, formatDocumentBase(data));
const recipeUpdate = (id, data) => updateDocument(`${ENTITY.RECIPE}/${id}`, formatDocumentBase(data));
const recipeDelete = id => deleteDocument(ENTITY.RECIPE, id);



// BLOG POST
const blogGetAll = (conditions = [], limit = 0) =>
  getCollectionOrderingWithConditions(ENTITY.BLOG, 'modified', conditions, limit);
const getBlogPostDetailById = id => getDocument(`${ENTITY.BLOG}/${id}`);
const addBlogPost = data => addDocument(ENTITY.BLOG, formatDocumentBlog(data));
const updateBlogPost = (id, data) =>
  updateDocument(`${ENTITY.BLOG}/${id}`, formatDocumentBlog(data));
const blogGetRelatedPostsByCategory = (category, limit = 6) => {
  const conditions = [
    {
      fieldName: 'category',
      operator: '==',
      value: category
    }
  ];

  return getCollectionOrderingWithConditions(ENTITY.BLOG, 'modified', conditions, limit);
}
const blogGetRelatedPostsByTags = (tags, limit = 6) => {
  const conditions = [
    {
      fieldName: 'tags',
      operator: 'array-contains-any',
      value: tags
    }
  ];

  return getCollectionOrderingWithConditions(ENTITY.BLOG, 'modified', conditions, limit);
}

// Admin DATA
const getAllSitemaps = (limit = 0) =>
  getCollectionOrderingWithConditions(ENTITY.SITEMAP, 'modified', [], limit);
const getSitemapDetailById = id => getDocument(`${ENTITY.SITEMAP}/${id}`);
const getSitemapDetailBySlugAndEntity = (slug, entity = ENTITY.BANK) => {
  const conditions = [
    {
      fieldName: 'slug',
      operator: '==',
      value: slug
    },
    {
      fieldName: 'type',
      operator: '==',
      value: entity
    },
  ];

  return getDocumentWithConditions(ENTITY.SITEMAP, conditions);
};
const addSitemap = data => addDocument(ENTITY.SITEMAP, formatDocumentBase(data));
const updateSitemap = (id, data) =>
  updateDocument(`${ENTITY.SITEMAP}/${id}`, formatDocumentBase(data));

module.exports.models = {
  // Cuisine
  cuisineGetAll,
  cuisineGetDetailById,
  cuisineAdd,
  cuisineUpdate,
  cuisineDelete,

  // Recipe
  recipeGetAll,
  recipeGetDetailById,
  recipeAdd,
  recipeUpdate,
  recipeDelete,

  // Blog
  blogGetAll,
  getBlogPostDetailById,
  addBlogPost,
  updateBlogPost,
  blogGetRelatedPostsByCategory,
  blogGetRelatedPostsByTags,

  // Admin model
  getAllSitemaps,
  getSitemapDetailById,
  getSitemapDetailBySlugAndEntity,
  addSitemap,
  updateSitemap
};
