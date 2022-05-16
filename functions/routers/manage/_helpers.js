// Constants
const { ENTITY } = require('../../constants');
const { BLOG_TAGS } = require('../../constants/blog');
const MODELS = require('../../models').models;

// Helpers
const { getRatingValue } = require('../../helpers');
const CONTENT = require('../../content/_helpers');
const {
  updateSitemapUrl,
  createOrUpdateSitemapBySlugAndEntity,
} = require('../../helpers/sitemap');

/**
 * Format time to hours and min, eg:
 * 30m = 30 mins | 80m = 1 hr 20 mins | 140m = 2 hrs 20 mins
 * @param {number} totalTime
 * @returns Time as text
 */
const getCookingTimeText = (totalTime = 0) => {
  let totalHour = parseInt(totalTime/60);
  let totalMin = parseInt(totalTime%60);
  const totalDay = parseInt(totalHour/24);

  // Format time as string
  let time = '';

  if (totalDay) {
    time += `${totalDay} d`;
    time += ' ';

    // Time is total min
    const newTime = totalTime - (totalDay*24*60);

    totalHour = parseInt(newTime/60);
    totalMin = parseInt(newTime%60);
  }
  if (totalHour) {
    time += `${totalHour} hr`;

    if (totalHour > 1) {
      time += 's';
    }

    time += ' ';
  }
  if (totalMin) {
    time += `${totalMin} min`;

    if (totalMin > 1) {
      time += 's';
    }
  }

  return time.trim();
};

// Get cooking time (duration) for schema markup
// Format: P0DT2H30M = 2 hrs 30 mins
const getCookingTimeSchema = (totalTime = 0) => {
  const totalHour = parseInt(totalTime/60);
  const totalMin = parseInt(totalTime%60);

  return `P0DT${totalHour}H${totalMin}M`;
};

//--- HELPER ---//
const createListLatestRecipe = () => {
  const conditions = [];
  let fileName = CONTENT.FILE_NAME.RECIPE_LATEST;

  return MODELS.recipeGetAll(conditions, 10)
    .then(data => {
      const latestRecipes = data
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .map(recipe => {
          const {
            name, slug, description, imgThumb, imgThumbWebP, serving,
            time = {}, ratings = [0, 0, 0, 0, 0],
          } = recipe;
          const totalTime = Number(time.prep || 0) + Number(time.cook || 0) + Number(time.additional || 0);

          return {
            name,
            slug,
            serving,
            description,
            imgThumb,
            imgThumbWebP,
            time: getCookingTimeText(totalTime),
            ratings: getRatingValue(ratings),
          };
        })

      return CONTENT.writeFileContent(fileName, latestRecipes);
    });
};

// List all Recipes for search
const updateListAllRecipe = (name= '', slug = '', prevSlug = '') => {
  const fileName = CONTENT.FILE_NAME.RECIPE_ALL;

  return CONTENT.readFileContent(fileName)
    .then((allRecipes = []) => {
      let newList = allRecipes;

      // Change slug, remove old item by prevSlug
      if (prevSlug.trim()) {
        newList = allRecipes.filter(recipe => recipe.slug !== prevSlug);
      }

      // Add this recipe to the list
      newList.push({ name, slug });

      return CONTENT.writeFileContent(fileName, newList);
    });
};

const AutoUpdateRecipeContent = (recipeId, slug = '', prevSlug = '') => {
  return MODELS.recipeGetDetailById(recipeId)
    .then(recipe => {
      const sitemapSlug = `${recipe.slug}`;
      const fileName = CONTENT.FILE_NAME.RECIPE_DETAIL(recipe.slug);

      // Update listing data
      createListLatestRecipe();
      // Update list all recipes if adding new or change slug
      if (slug !== prevSlug) {
        updateListAllRecipe(recipe.name, slug, prevSlug);
      }

      // Format time
      const totalTime = Number(recipe.time.prep || 0) + Number(recipe.time.cook || 0) + Number(recipe.time.additional || 0);
      const formatTime = {
        prep: getCookingTimeText(recipe.time.prep),
        additional: getCookingTimeText(recipe.time.additional),
        cook: getCookingTimeText(recipe.time.cook),
        total: getCookingTimeText(totalTime),
      };
      const formatTimeSchema = {
        prep: getCookingTimeSchema(recipe.time.prep),
        additional: getCookingTimeSchema(recipe.time.additional),
        cook: getCookingTimeSchema(recipe.time.cook),
        total: getCookingTimeSchema(totalTime),
      };

      // Get calories
      const nutritionCalories = (recipe.nutritions || []).find(it => it.name === 'calories');
      const calories = nutritionCalories ? nutritionCalories.value : 10;

      return CONTENT.writeFileContent(fileName, {
        ...recipe,
        time: formatTime,
        timeSchema: formatTimeSchema,
        ratings: getRatingValue(recipe.ratings),
        calories
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
