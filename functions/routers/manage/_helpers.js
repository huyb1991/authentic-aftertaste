// Constants
const { ENTITY } = require('../../constants');
const { BLOG_TAGS } = require('../../constants/blog');
const MODELS = require('../../models').models;

// Helpers
const CONTENT = require('../../content/_helper').readContent;
const { createOrUpdateSitemapBySlugAndEntity } = require('../../helpers/sitemap');

//--- HELPER ---//
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
  AutoUpdateBlogPostContent
};