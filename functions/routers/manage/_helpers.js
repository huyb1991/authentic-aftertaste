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

const sortByOrder = (data = []) => {
  return data.sort((a, b) => Number(a.order) - Number(b.order));
};

// Private constants
const NUMBER_OF_RELATED_ITEMS = 3;

// Calculating recipe total time
const getTotalTime = (time = {}) => {
  return Number(time.prep || 0) + Number(time.cook || 0) + Number(time.additional || 0);
};

/**
 * Get cooking time by group by object: { day: X, hour: Y, min: Z };
 * @param {*} totalTime 
 * @returns {Object}
 */
const getCookingTime = (totalTime = 0) => {
  let totalHour = parseInt(totalTime/60);
  let totalMin = parseInt(totalTime%60);
  const totalDay = parseInt(totalHour/24);

  if (totalDay) {
    // Time is total min
    const newTime = totalTime - (totalDay*24*60);

    totalHour = parseInt(newTime/60);
    totalMin = parseInt(newTime%60);
  }

  return {
    day: totalDay || 0,
    hour: totalHour || 0,
    min: totalMin || 0,
  };
};

/**
 * Format time to hours and min, eg:
 * 30m = 30 mins | 80m = 1 hr 20 mins | 140m = 2 hrs 20 mins
 * @param {number} totalTime
 * @returns Time as text
 */
const getCookingTimeText = (totalTime = 0) => {
  const { day, hour, min } = getCookingTime(totalTime);

  // Format time as string
  let time = '';
  if (day) {
    time += `${day} d`;
    time += ' ';
  }
  if (hour) {
    time += `${hour} hr`;

    if (hour > 1) {
      time += 's';
    }

    time += ' ';
  }
  if (min) {
    time += `${min} min`;

    if (min > 1) {
      time += 's';
    }
  }

  return time.trim();
};

// Get cooking time (duration) for schema markup
// Format: P0DT2H30M = 2 hrs 30 mins
const getCookingTimeSchema = (totalTime = 0) => {
  const { day, hour, min } = getCookingTime(totalTime);

  return `P${day}DT${hour}H${min}M`;
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
          const totalTime = getTotalTime(time);

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

// Get 3 latest recipes by cuisine
const getLatestRecipeSlugByCuisine = (cuisine = '') => {
  const conditions = [];

  if (!!cuisine.trim()) {
    conditions.push({
      fieldName: 'cuisine',
      operator: '==',
      value: cuisine
    });
  }

  return MODELS.recipeGetAll(conditions, NUMBER_OF_RELATED_ITEMS)
    .then(items => items.map(it => it.slug));
};

// Get short content for to display on related recipes
const getRelatedRecipesBySlug = (slugs = []) => {
  const conditions = [];

  if (slugs.length) {
    conditions.push({
      fieldName: 'slug',
      operator: 'in',
      value: slugs,
    });
  }

  return MODELS.recipeGetAll(conditions, NUMBER_OF_RELATED_ITEMS)
    .then(items => items.map(({
      id,
      name,
      slug,
      description,
      time,
      serving,
      imgThumb,
      imgThumbWebP,
    }) => {
      const totalTime = getTotalTime(time);

      return {
        id,
        name,
        slug,
        description,
        imgThumb,
        imgThumbWebP,
        serving,
        time: getCookingTimeText(totalTime),
      };
    }));
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
      const totalTime = getTotalTime(recipe.time);
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

      return getRelatedRecipesBySlug(recipe.relatedRecipes)
        .then(relatedRecipes => {
          return CONTENT.writeFileContent(fileName, {
            ...recipe,
            calories,
            relatedRecipes,
            time: formatTime,
            timeSchema: formatTimeSchema,
            ratings: getRatingValue(recipe.ratings),
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
  sortByOrder,
  getLatestRecipeSlugByCuisine,
  AutoUpdateBlogPostContent,
  AutoUpdateRecipeContent,
};
