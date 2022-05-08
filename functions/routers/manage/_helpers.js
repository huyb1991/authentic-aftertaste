// Constants
const { ENTITY } = require('../../constants');
const { BLOG_TAGS } = require('../../constants/blog');
const MODELS = require('../../models').models;

// Helpers
const CONTENT = require('../../content/_helpers');
const {
  updateSitemapUrl,
  createOrUpdateSitemapBySlugAndEntity,
} = require('../../helpers/sitemap');

//--- HELPER ---//
const createListLastestRecipe = () => {
  const conditions = [];
  let fileName = CONTENT.FILE_NAME.RECIPE_LATEST;

  return MODELS.recipeGetAll(conditions, 10)
    .then(data => {
      const latestRecipes = data
        .map(({ name, slug, description, imgThumb, updated, created }) => ({
          name, slug, description, imgThumb, updated, created
        }))
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

      return CONTENT.writeFileContent(fileName, latestRecipes);
    });
};

const AutoUpdateRecipeContent = (recipeId, slug = '', prevSlug = '') => {
  return MODELS.recipeGetDetailById(recipeId)
    .then(recipe => {
      const sitemapSlug = `${recipe.slug}`;
      const fileName = CONTENT.FILE_NAME.RECIPE_DETAIL(recipe.slug);

      createListLastestRecipe();
      return CONTENT.writeFileContent(fileName, {
        ...recipe,
      })
      .then(() => {
        // Change sitemap url after change slug
        if (prevSlug.trim() && slug.trim() !== prevSlug.trim()) {
          const oldUrl = `${BASE_URL_SITEMAP}/${ENTITY.RECIPE}/${prevSlug}`;
          const newUrl = `${BASE_URL_SITEMAP}/${ENTITY.RECIPE}/${slug}`;

          return updateSitemapUrl(oldUrl, newUrl);
        }

        return createOrUpdateSitemapBySlugAndEntity(sitemapSlug, ENTITY.RECIPE)
          .then(() => recipe.id);
      });
    });
};

// Save BlogPost content
const AutoUpdateBlogPostContent = (
  blogId,
  slug,
  prevSlug = '',
  updateSitemap = true
) => {
  return MODELS.getBlogPostDetailById(blogId)
    .then(blogPost => {
      if (!blogPost.published) {
        // This is not ready post
        return;
      }

      return MODELS.blogGetRelatedPostsByTags(blogPost.tags)
        .then((data = []) => {
          const relatedPosts = data
            .filter(it => it.id !== blogId)
            .map(({ title, slug }) => ({
              title,
              slug: `blog/${blogPost.category}/${slug}`
            }));

          const sitemapSlug = `${ENTITY.BLOG}/${blogPost.category}/${slug}`;
          const fileName = CONTENT.FILE_NAME.BLOG_POST(blogPost.category, slug);
          delete blogPost['slugArr'];

          const blogTags = (blogPost.tags || []).map(it =>
            BLOG_TAGS.find(tag => tag.slug === it)
          ).filter(it => !!it);

          return CONTENT.writeFileContent(fileName, {
            ...blogPost,
            tags: blogTags,
            relatedPosts
          })
          .then(() => {
            // Skip update sitemap incase multiple data
            if (!updateSitemap) {
              return;
            }
  
            if (slug.trim() !== prevSlug.trim()) {
              console.log('diff sitemap');
  
              return;
            }
  
            return createOrUpdateSitemapBySlugAndEntity(sitemapSlug, ENTITY.BLOG)
              .then(() => blogPost.id);
          });
        });
    });
};

module.exports = {
  AutoUpdateBlogPostContent,
  AutoUpdateRecipeContent,
};
