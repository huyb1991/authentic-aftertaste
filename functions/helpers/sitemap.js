const { readFile, writeFile } = require('fs').promises;

const {
  ENTITY,
  CATEGORY_SLUG,
  BASE_URL_SITEMAP
} = require('../constants');
const { getTodayFormat } = require('../helpers');
const MODELS = require('../models').models;

const SITEMAP_PATH = __dirname + '/../../public/sitemap.xml';
const CHANGE_FREQ = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  NEVER: 'never',
};

const PRIORITY = {
  HOMEPAGE: '1.0',
  RECIPE: '0.6',
  BLOG: '0.4',
  STATIC_PAGE: '0.2'
};

// Homepage & static pages
const defaultItems = [
  {
    url: `${BASE_URL_SITEMAP}`,
    lastmod: '2022-05-05',
    changefreq: CHANGE_FREQ.WEEKLY,
    priority: PRIORITY.HOMEPAGE,
  }
];

// Incase change sitemap url
const updateSitemapUrl = (oldUrl, newUrl) => {
  const currentUrlLoc= `<loc>${oldUrl}</loc>`;
  const newUrlLoc= `<loc>${newUrl}</loc>`;
  const newUrlLocWithLastMod = `${newUrlLoc}<lastmod>`;

  return readFile(SITEMAP_PATH, 'utf8')
    .then(data => {
      if (data.indexOf(currentUrlLoc) === -1) {
        return;
      }

      const currentContent = data.replace(currentUrlLoc, newUrlLoc);
      const splitContent = currentContent.split(newUrlLocWithLastMod);
      const contentFirst = splitContent[0];
      const contentLast = splitContent[1];
      const contentLastUpdate = getTodayFormat() + contentLast.slice(getTodayFormat().length);
      const newContent = contentFirst + newUrlLocWithLastMod + contentLastUpdate;

      return writeFile(SITEMAP_PATH, newContent);
    });
};

const generateSitemapItem = ({ url, lastmod, changefreq, priority }) => {
  let sitemapItem = `<url><loc>${url}</loc>`;
  sitemapItem += `<lastmod>${lastmod}</lastmod>`;
  sitemapItem += `<changefreq>${changefreq}</changefreq>`;
  sitemapItem += `<priority>${priority}</priority></url>`;

  return sitemapItem;
};

/**
 * @param {*} items SiteMap content as string
 */
const createSiteMapFile = (items) => {
  let content = '';
  content += '<?xml version="1.0" encoding="UTF-8"?>';
  content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  content += `${items.join('')}`;
  content += '</urlset>';

  return content;
};

const createSitemapItem = (
  url,
  lastmod,
  entity = ENTITY.HOMEPAGE
) => {
  // Default is Home
  let changefreq = CHANGE_FREQ.YEARLY;
  let priority = PRIORITY.HOMEPAGE;

  if (entity === ENTITY.RECIPE) {
    changefreq = CHANGE_FREQ.MONTHLY;
    priority = PRIORITY.RECIPE;
  }
  if (entity === ENTITY.BLOG) {
    changefreq = CHANGE_FREQ.MONTHLY;
    priority = PRIORITY.BLOG;
  }

  return generateSitemapItem({ url, lastmod, changefreq, priority });
};

const insertSiteMapItem = (item) => {
  return readFile(SITEMAP_PATH, 'utf8')
    .then(data => {
      const closeTag = '</urlset>';
      const content = data.split(closeTag);
  
      // Insert item to end of file before closing tag
      const newContent = [
        content[0],
        item,
        [closeTag],
      ].join('');

      return writeFile(SITEMAP_PATH, newContent);
    });
};

// Reading file then do trick to remove item instead of casting to xml format then finding node
const removeSiteMapItem = (locUrl) => {
  return readFile(SITEMAP_PATH, 'utf8')
    .then(data => {
      if (data.indexOf(locUrl) < 0) {
        return;
      }

      const prevOpenTag = '<url><loc>';
      const nextCloseTag = '</url>';
      const content = data.split(locUrl);

      const nextCloseTagIdx = content[1].indexOf(nextCloseTag);
      const prevItems = content[0].slice(0, -prevOpenTag.length);
      const nextItems = content[1].substr(nextCloseTagIdx + nextCloseTag.length, content[1].length);

      const newContent = [prevItems, nextItems].join('');
      return writeFile(SITEMAP_PATH, newContent);
    });
};

// Re-generate item from DB
const reGenerateSitemapItem = ({ id, url, modified, type }) => {
  const newItem = createSitemapItem(url, modified, type);

  return removeSiteMapItem(url)
    .then(() => insertSiteMapItem(newItem));
};

// Update modified date for Homepage item, always update to today
const reGenerateSitemapHomepage = () => {
  const homePageItem = defaultItems.find(it => it.priority === PRIORITY.HOMEPAGE);

  if (homePageItem) {
    const newItem = generateSitemapItem({
      ...homePageItem,
      lastmod: getTodayFormat()
    });

    // Add "<" character to to the trick.
    // This is already end of homepage url and this is close tag character
    // This is unique url in all sitemap file
    return removeSiteMapItem(`${homePageItem.url}<`)
      .then(() => insertSiteMapItem(newItem));
  }
};

const createOrUpdateSitemapBySlugAndEntity = (slug, entity = ENTITY.RECIPE) => {
  return MODELS.getSitemapDetailBySlugAndEntity(slug, entity)
    .then(sitemap => {
      if (sitemap) {
        const newSitemap = {
          ...sitemap,
          generated: true,
          modified: getTodayFormat()
        };

        return MODELS.updateSitemap(sitemap.id, newSitemap)
          .then(() => reGenerateSitemapItem(newSitemap));
      } else {
        // BLOG won't have category slug, this based on blog category
        const slugUrl = `${BASE_URL_SITEMAP}/${CATEGORY_SLUG[entity]}/${slug}`;
        const slugUrlFormat = slugUrl.toString().replace('//blog', '/blog');
        const newSitemap = {
          url: slugUrlFormat,
          slug: slug,
          type: entity,
          modified: getTodayFormat(),
          generated: true
        };

        return MODELS.addSitemap(newSitemap)
          .then(() => reGenerateSitemapItem(newSitemap));
      }
    });
};

const generateSitemap = () => {
  return MODELS.getAllSitemaps()
    .then(data => {
      const seedItems = data.map(({
        url,
        modified,
        type
      }) => createSitemapItem(url, modified, type));
      const defaultSitemap = defaultItems.map(it => generateSitemapItem(it));
      const allItems = [...defaultSitemap, ...seedItems];

      return writeFile(SITEMAP_PATH, createSiteMapFile(allItems)).then(() => data);
    })
    .then(data => {
      return data.forEach(({ id, ...other }) => {
        const newData = {
          ...other,
          generated: true
        };

        return MODELS.updateSitemap(id, newData);
      });
    });
};

module.exports = {
  generateSitemap,
  updateSitemapUrl,
  reGenerateSitemapHomepage,
  reGenerateSitemapItem,
  createOrUpdateSitemapBySlugAndEntity
};
