const express = require('express');
const router = express.Router();

// Route to allow the user to get to the home page
router.get('/', (req, res) => {
    // Render the home view with the title 'Home'
    res.render('home', { title: 'Home' });
});

module.exports = router;