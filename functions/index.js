const functions = require('firebase-functions');
const express = require('express');

// Constants
const { BASE_URL, BASE_URL_ADMIN } = require('./constants');

// Helpers
const { render404Page } = require('./helpers');

// Config APP
const app = express();
const viewDir = `${__dirname}/views`;

// Setup template
app.set('views', viewDir);
app.set('view engine', 'pug');

// Global variables
app.locals.BASE_URL = BASE_URL;
app.locals.BASE_URL_ADMIN = BASE_URL_ADMIN;
app.locals.SITE_NAME = 'Authentic Aftertaste';
app.locals.SITE_LOGO = 'img/logo.png';
app.locals.SITE_TITLE = 'Authentic Aftertaste - Authentic Recipe';
app.locals.SITE_DESC = 'Find authentic traditional food recipes for everyday cooking inspiration. Discover real recipes and how to cooks as local food aftertaste';

// Routers
app.use(require('./routers'));

// Handle 404 pages
app.use((req, res, next) => render404Page(res));

exports.app = functions.https.onRequest(app);
