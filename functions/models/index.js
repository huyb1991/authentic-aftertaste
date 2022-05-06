const { ENTITY } = require('../constants');

const {
  getDocument,
  getCollectionOrderingWithConditions,
  getDocumentWithConditions,
  addDocument,
  updateDocument
} = require('./helper');

// Format document
const {
  formatDocumentBase,
  formatDocumentBlog
} = require('./format');

// COUNTRY
const countryGetAll = (conditions = [], limit = 0) =>
  getCollectionOrderingWithConditions(ENTITY.COUNTRY, 'name', conditions, limit);
const countryGetDetailById = id => getDocument(`${ENTITY.COUNTRY}/${id}`);
const countryAdd = data => addDocument(ENTITY.COUNTRY, formatDocumentBase(data));
const countryUpdate = (id, data) => updateDocument(`${ENTITY.COUNTRY}/${id}`, formatDocumentBase(data));
const countryDelete = id => deleteDocument(ENTITY.COUNTRY, id);



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
  countryGetAll,
  countryGetDetailById,
  countryAdd,
  countryUpdate,
  countryDelete,

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
