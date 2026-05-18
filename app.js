const path = require('path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const { sessionConfig } = require('./config/database');
const { sessionCookieName, getSessionCookieOptions, getTrustProxySetting } = require('./config/session');
const { adminNoStore, publicDynamicCacheControl } = require('./middleware/cacheControl');
const viewHelpers = require('./middleware/viewHelpers');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
let sessionStore;

const trustProxy = getTrustProxySetting();

if (process.env.USE_DB_SESSIONS === 'true') {
  sessionStore = new MySQLStore(sessionConfig);
}

if (trustProxy !== false) {
  app.set('trust proxy', trustProxy);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
  express.static(path.join(__dirname, 'public'), {
    etag: true,
    lastModified: true,
    maxAge: process.env.STATIC_ASSET_MAX_AGE || '7d'
  })
);
app.use(
  session({
    key: sessionCookieName,
    secret: process.env.SESSION_SECRET || 'development-secret',
    resave: false,
    saveUninitialized: false,
    proxy: trustProxy !== false,
    ...(sessionStore ? { store: sessionStore } : {}),
    cookie: getSessionCookieOptions()
  })
);
app.use(flash());
app.use(viewHelpers);

app.use('/admin', adminNoStore, adminRoutes);
app.use('/', publicDynamicCacheControl, publicRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    pageMeta: {
      title: 'Page Not Found',
      description: 'The page you are looking for could not be found.'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('pages/500', {
    title: 'Server Error',
    pageMeta: {
      title: 'Server Error',
      description: 'Something went wrong while processing your request.'
    }
  });
});

module.exports = app;
