// Core Modules & Third-Party Libraries
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');

// Route Imports
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');
const foodRouter = require('./routes/food');
const testimonialRouter = require('./routes/testimonial');
const requestRouter = require('./routes/request');
const ourTeamsRouter = require('./routes/ourTeams');

// Data Imports
const footerData = require('./data/footerData');
const errorData = require('./data/errorData');
const notFoundData = require('./data/notFoundData');

// Initialize Express App
const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/plateshare';

// --------------------
// Safety Checks
// --------------------
if (isProduction && !process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required in production.');
}

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required in production.');
}

// --------------------
// Database Connection
// --------------------
mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --------------------
// View Engine Setup
// --------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --------------------
// Middleware Setup
// --------------------
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// --------------------
// SESSION (MUST BE FIRST)
// --------------------
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// --------------------
// FLASH (MUST BE AFTER SESSION)
// --------------------
app.use(flash());

// --------------------
// Global Template Variables
// --------------------
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.memberId = req.session.memberId || null;

  // SAFE FLASH (prevents crash)
  try {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
  } catch (err) {
    res.locals.success = [];
    res.locals.error = [];
  }

  next();
});

// --------------------
// Routes
// --------------------
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', userRouter);
app.use('/food', foodRouter);
app.use('/testimonial', testimonialRouter);
app.use('/request', requestRouter);
app.use('/ourTeams', ourTeamsRouter);

// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).render('notFound', {
    ...notFoundData,
    footerData,
    requestedUrl: req.originalUrl,
    success: [],
    error: []
  });
});

// --------------------
// Global Error Handler
// --------------------
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const showDetails = !isProduction;

  console.error(err);

  res.status(statusCode).render('error', {
    ...errorData,
    footerData,
    statusCode,
    message: statusCode === 500 && isProduction ? errorData.message : err.message,
    stack: showDetails ? err.stack : null,
    success: [],
    error: []
  });
});

// --------------------
// Export App
// --------------------
module.exports = app;