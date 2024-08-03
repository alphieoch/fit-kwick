const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'fit-kwick-secret',
    resave: false,
    saveUninitialized: true
}));

// Configure view engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Import route modules
const homeRoutes = require('./routes/home');
const customerRoutes = require('./routes/customers');
const bookingRoutes = require('./routes/bookings');

// Set up routes
app.use('/', homeRoutes);
app.use('/customers', customerRoutes);
app.use('/bookings', bookingRoutes);

// Make user and message data available to views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Handle other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { title: 'Error', message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;