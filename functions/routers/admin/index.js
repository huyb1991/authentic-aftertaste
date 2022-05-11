// Constants
const MODELS = require('../../models').models;
const CONTENT = require('../../content/_helpers');
const {
  ENTITY,
  RECIPE_CATEGORY,
  BASE_URL_SITEMAP,
} = require('../../constants');
// const { BLOG_CATEGORY, BLOG_TAGS } = require('../../constants/blog');

// Helpers
const {
  getTodayFormat,
  getFlashMessage
} = require('../../helpers');
const {
  generateSitemap,
  reGenerateSitemapItem
} = require('../../helpers/sitemap');

//--- ROUTERS ---//
const Dashboard = (req, res) => {
  const flashMessage = getFlashMessage(req.query);

  return res.render(
    'admin/index',
    {
      title: 'Admin Dashboard',
      ...flashMessage
    },
  );
};

const APIDataRefer = (req, res) => {
  const entities = Object.entries(ENTITY)
    .filter(([key, value]) => value !== ENTITY.SITEMAP)
    .map(([key, value]) => ({
      name: value,
      value,
    }));
  const categories = Object.entries(RECIPE_CATEGORY)
    .map(([key, value]) => ({
      name: value.name,
      value: value.slug,
    }));
  // const tags = BLOG_TAGS;

  return res.json({
    entities,
    categories,
    // tags
  });
};

//--- ADMIN TOOLS ---//
const SitemapSeedDB = (req, res) => {
  const actionMsg = 'Seed Sitemap DB';

  return Promise.all([
    CONTENT.getListFileInFolder(ENTITY.BANK),
    CONTENT.getListFileInFolder(ENTITY.RATE),
  ]).then(data => {
    const banks = data[0];
    const rates = data[1];

    // Add banks to sitemap
    banks.forEach(bank => {
      const bankSitemap = {
        url: `${BASE_URL_SITEMAP}/ngan-hang/${bank}`,
        slug: bank,
        type: ENTITY.BANK,
        modified: getTodayFormat()
      };

      MODELS.addSitemap(bankSitemap);
    });

    // Add rate to sitemap
    rates.forEach(rate => {
      const rateSitemap = {
        url: `${BASE_URL_SITEMAP}/lai-suat/${rate}`,
        slug: rate,
        type: ENTITY.RATE,
        modified: getTodayFormat()
      };

      MODELS.addSitemap(rateSitemap);
    });

    const message = encodeURIComponent(`Successfully ${actionMsg}.`);
    return res.redirect(`/admin/${ENTITY.SITEMAP}/?success=true&message=${message}`);
  })
  .catch(err => {
    console.log(`${actionMsg} error: ${err.message}`);
    const message = encodeURIComponent(`${actionMsg} error!!!`);

    return res.redirect(`/admin/${ENTITY.SITEMAP}/?error=true&message=${message}`);
  });
};

const SitemapGenerate = (req, res) => {
  const actionMsg = 'Generate Sitemap';

  return generateSitemap()
    .then(() => {
      const message = encodeURIComponent(`Successfully ${actionMsg}.`);
      return res.redirect(`/admin/${ENTITY.SITEMAP}/?success=true&message=${message}`);
    })
    .catch(err => {
      console.log(`${actionMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionMsg} error!!!`);
  
      return res.redirect(`/admin/${ENTITY.SITEMAP}/?error=true&message=${message}`);
    });
};

// Re-generate sitemap and updated modified date
const SitemapReGenerateItem = (req, res) => {
  const actionMsg = 'Re-generate sitemap item';
  const { id } = req.params;

  return MODELS.getSitemapDetailById(id)
    .then(sitemap => {
      const newSitemap = {
        ...sitemap,
        modified: getTodayFormat(),
        generated: true
      };

      return MODELS.updateSitemap(id, newSitemap)
        .then(() => {
          return reGenerateSitemapItem(newSitemap)
            .then(() => {
              const message = encodeURIComponent(`Successfully ${actionMsg}. Id: ${id}.`);
              return res.redirect(`/admin/${ENTITY.SITEMAP}/?success=true&message=${message}`);
            });
        });
    }).catch(err => {
      console.log(`${actionMsg} error: ${err.message}`);
      const message = encodeURIComponent(`${actionMsg} error!!!`);

      return res.redirect(`/admin/${ENTITY.SITEMAP}/?error=true&message=${message}`);
    });
};

module.exports.router = {
  Dashboard,
  APIDataRefer,

  // ADMIN TOOLS
  SitemapSeedDB,
  SitemapGenerate,
  SitemapReGenerateItem,
};
