// Constants
const MODELS = require('../../models').models;
const { ENTITY } = require('../../constants');

// Helpers
const {
  getFlashMessage,
  convertToSlug
} = require('../../helpers');
const { createOrUpdateSitemapBySlugAndEntity } = require('../../helpers/sitemap');
const { AutoUpdateBlogPostContent } = require('./_helpers');

//--- BLOG POST ROUTERS ---//
const BlogPostList = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const { query = '' } = req.query;
  const querySlug = convertToSlug(query);
  const headers = [
    { name: 'Title', field: 'title' },
    { name: 'Category', field: 'category' },
    { name: 'Published', field: 'published', status: true },
    { name: 'Modified', field: 'modified' },
    { name: 'Operator', field: '_' },
  ];

  const conditions = [];

  if (!!querySlug.trim()) {
    conditions.push({
      fieldName: 'slugArr',
      operator: 'array-contains',
      value: querySlug
    });
  }

  return MODELS.blogGetAll(conditions, 40)
    .then(data => {
      const dataOrdering = data.sort((a, b) => b.modified.localeCompare(a.modified));

      return res.render(
        'admin/list',
        {
          title: 'BlogPost Listing',
          entity: ENTITY.BLOG,
          headers,
          data: dataOrdering,
          query,
          ...flashMessage
        },
      );
    })
};

const BlogPostDetail = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const { id } = req.params;

  // Create new BlogPost
  if (id === 'create') {
    return res.render(
      'admin/blog/detail',
      {
        title: 'Create New Blog Post',
        entity: ENTITY.BLOG,
        data: {},
        ...flashMessage
      },
    );
  }

  return MODELS.getBlogPostDetailById(id)
    .then(data => {
      return res.render(
        `admin/${ENTITY.BLOG}/detail`,
        {
          title: 'Blog Post Detail',
          entity: ENTITY.BLOG,
          data,
          ...flashMessage
        },
      );
    });
};

const BlogPostDetailUpdate = (req, res) => {
  const { id } = req.params;
  const blogId = req.body.id;
  const { published, prevSlug, slug, tags, ...others } = req.body;
  const blogTags = tags.split(',');

  const actionMsg = 'Create / Update Blog Post';
  const blogPostData = {
    ...others,
    slug,
    tags: blogTags,
    published: Boolean(Number(published)),
  };

  // Create new Blog Post
  if (id === 'create') {
    return MODELS.addBlogPost(blogPostData)
      .then(newId => {
        return AutoUpdateBlogPostContent(newId, slug, prevSlug)
          .then(() => {
            const message = encodeURIComponent(`Successfully ${actionMsg} id: ${newId}.`);
            return res.redirect(`/admin/${ENTITY.BLOG}/${newId}/?success=true&message=${message}`);
          });
      })
      .catch(err => {
        console.log(`${actionMsg} error: ${err.message}`);
        const message = encodeURIComponent(`${actionMsg} error!!!`);

        return res.redirect(`/admin/${ENTITY.BLOG}/?error=true&message=${message}`);
      });
  }

  return MODELS.updateBlogPost(blogId, blogPostData)
    .then(() => {
      return AutoUpdateBlogPostContent(blogId, slug, prevSlug)
        .then(() => {
          const message = encodeURIComponent(`Successfully ${actionMsg } id: ${blogId}.`);
          return res.redirect(`/admin/${ENTITY.BLOG}/${blogId}/?success=true&message=${message}`);
        });
    })
    .catch(err => {
      console.log(`${actionMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionMsg } error!!!`);

      return res.redirect(`/admin/${ENTITY.BLOG}/?error=true&message=${message}`);
    });
};

//--- SITEMAP ROUTERS ---//
const SitemapList = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const headers = [
    { name: 'Id', field: 'id' },
    { name: 'Url', field: 'url', url: true },
    { name: 'Sitemap', field: 'generated', status: true },
    { name: 'Slug', field: 'slug' },
    { name: 'Type', field: 'type' },
    { name: 'Modified Date', field: 'modified' },
    { name: 'Operator', field: '_' },
  ];

  return MODELS.getAllSitemaps(10)
    .then(data => {
      const dataOrdering = data.sort((a, b) => b.modified.localeCompare(a.modified));

      return res.render(
        'admin/list',
        {
          title: 'Sitemap Listing',
          entity: ENTITY.SITEMAP,
          headers,
          data: dataOrdering,
          ...flashMessage
        },
      );
    });
};

const SitemapDetail = (req, res) => {
  const flashMessage = getFlashMessage(req.query);
  const { id } = req.params;

  // Create new Sitemap
  if (id === 'create') {
    return res.render(
      `admin/${ENTITY.SITEMAP}/detail`,
      {
        title: 'Create New Sitemap',
        entity: ENTITY.SITEMAP,
        data: {},
        ...flashMessage
      },
    );
  }

  return MODELS.getSitemapDetailById(id)
    .then(data => {
      return res.render(
        `admin/${ENTITY.SITEMAP}/detail`,
        {
          title: 'Sitemap Detail',
          entity: ENTITY.SITEMAP,
          data,
          ...flashMessage
        },
      );
    });
};

const SitemapDetailUpdate = (req, res) => {
  const { id } = req.params;
  const slug = req.body.slug;
  const entity = req.body.entity;
  const actionMsg = 'Create/Update Sitemap';
  const sitemapData = {
    ...req.body,
    generated: Boolean(Number(req.body.generated))
  };

  // Create new Bank
  if (id === 'create') {
    return MODELS.addSitemap(sitemapData)
      .then(newId => {
        return createOrUpdateSitemapBySlugAndEntity(slug, entity)
          .then(() => {
            const message = encodeURIComponent(`Successfully ${actionMsg}: ${newId}.`);
            return res.redirect(`/admin/${ENTITY.SITEMAP}/${newId}/?success=true&message=${message}`);
          });
      })
      .catch(err => {
        const message = encodeURIComponent(`${actionMsg} error!!!`);
        return res.redirect(`/admin/${ENTITY.SITEMAP}/?error=true&message=${message}`);
      });
  }

  // Update Sitemap
  return MODELS.updateSitemap(id, sitemapData)
    .then(() => {
      return createOrUpdateSitemapBySlugAndEntity(slug, entity)
      .then(() => {
        const message = encodeURIComponent(`Successfully ${actionMsg}.`);
        return res.redirect(`/admin/${ENTITY.SITEMAP}/${id}/?success=true&message=${message}`);
      });
    })
    .catch(err => {
      console.log('Update Bank error: ' + err);
      const message = encodeURIComponent(`${actionMsg} error!!!`);
      return res.redirect(`/admin/${ENTITY.SITEMAP}/?error=true&message=${message}`);
    });
};

module.exports.router = {
  // CRUD
  BlogPostList,
  BlogPostDetail,
  BlogPostDetailUpdate,

  SitemapList,
  SitemapDetail,
  SitemapDetailUpdate
};
