const express = require('express');
let router = express.Router();

// Middleware
const { isAdminGroup } = require('./middlewares');

// Routers
const client = require('./client');
const manage = require('./manage'); // CRUD
const admin = require('./admin'); // Admin tools

// Middle ware that is specific to this router
router.use((req, res, next) => next());

router
  // CLIENT routers
  .get('/', (req, res) => client.router.HomeController(req, res))
  .get('/recipe/:slug', (req, res) => client.router.RecipeDetailController(req, res))
  .get('/blog/:category/:slug', (req, res) => client.router.BlogPostController(req, res))
  // AMP Pages
  .get('/amp', (req, res) => client.router.HomeController(req, res, true))
  .get('/amp/recipe/:slug', (req, res) => client.router.RecipeDetailController(req, res, true))
  .get('/amp/blog/:category/:slug', (req, res) =>
    client.router.BlogPostController(req, res, true))

  // ADMIN routers
  .get('/admin', isAdminGroup, (req, res) => admin.router.Dashboard(req, res))
  .get('/admin/api-all-data', isAdminGroup, (req, res) => admin.router.APIDataRefer(req, res))
  // Recipe
  .get('/admin/recipe', isAdminGroup, (req, res) => manage.router.RecipeList(req, res))
  .get('/admin/recipe/:id', isAdminGroup, (req, res) => manage.router.RecipeDetail(req, res))
  .post('/admin/recipe/:id', isAdminGroup, (req, res) => manage.router.RecipeDetailUpdate(req, res))
  .get('/admin/recipe/delete/:id', isAdminGroup, (req, res) => manage.router.RecipeDetailDelete(req, res))
  // Country
  .get('/admin/country', isAdminGroup, (req, res) => manage.router.CountryList(req, res))
  .get('/admin/country/:id', isAdminGroup, (req, res) => manage.router.CountryDetail(req, res))
  .post('/admin/country/:id', isAdminGroup, (req, res) => manage.router.CountryDetailUpdate(req, res))
  .get('/admin/country/delete/:id', isAdminGroup, (req, res) => manage.router.CountryDetailDelete(req, res))
  // Blog
  .get('/admin/blog', isAdminGroup, (req, res) => manage.router.BlogPostList(req, res))
  .get('/admin/blog/:id', isAdminGroup, (req, res) => manage.router.BlogPostDetail(req, res))
  .post('/admin/blog/:id', isAdminGroup, (req, res) => manage.router.BlogPostDetailUpdate(req, res))
  // Sitemap Management
  .get('/admin/sitemap', isAdminGroup, (req, res) => manage.router.SitemapList(req, res))
  .get('/admin/sitemap/:id', isAdminGroup, (req, res) => manage.router.SitemapDetail(req, res))
  .post('/admin/sitemap/:id', isAdminGroup, (req, res) => manage.router.SitemapDetailUpdate(req, res))

  // TOOLS
  .get('/admin/sitemap-seed-db', isAdminGroup, (req, res) =>
    admin.router.SitemapSeedDB(req, res))
  .get('/admin/sitemap-generate', isAdminGroup, (req, res) =>
    admin.router.SitemapGenerate(req, res))
  .get('/admin/sitemap-regenerate/:id', isAdminGroup, (req, res) =>
    admin.router.SitemapReGenerateItem(req, res))

  // Static pages
  .get('/lien-he', (req, res) => client.router.ContactPage(req, res))
  .get('/ve-chung-toi', (req, res) => client.router.AboutUsPage(req, res))
  .get('/dieu-khoan', (req, res) => client.router.TermOfUsePage(req, res))
  .get('/mien-tru-trach-nhiem', (req, res) => client.router.DisclaimerPage(req, res))
  ;

module.exports = router;