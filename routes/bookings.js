const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Route to list all bookings
router.get('/', async (req, res) => {
    try {
        // Query the database to retrieve bookings with customer names
        const [rows] = await db.query(`
            SELECT b.*, c.name as customer_name 
            FROM Booking b 
            JOIN Customer c ON b.customer_id = c.customer_id
            ORDER BY b.date DESC, b.time DESC
        `);
        // Render the bookings list view with the retrieved data
        res.render('bookings/list', { title: 'Booking List', bookings: rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving bookings');
    }
});

// Route to show the add booking form
router.get('/add', async (req, res) => {
    try {
        // Query the database to retrieve customer data for the form
        const [customers] = await db.query('SELECT customer_id, name FROM Customer');
        // Render the add booking form with the customer data
        res.render('bookings/add', { title: 'Make a Booking', customers });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving customers');
    }
});

// Route to handle adding a new booking
router.post('/add', async (req, res) => {
    const { customer_id, date, time, activity_type } = req.body;
    const errors = [];

    // Validate form inputs
    if (!customer_id) errors.push('Customer is required');
    if (!date) errors.push('Date is required');
    if (!time) errors.push('Time is required');
    if (!activity_type || !['gym', 'swim'].includes(activity_type)) {
        errors.push('Valid activity type is required');
    }

    // If there are validation errors, re-render the form with error messages
    if (errors.length > 0) {
        const [customers] = await db.query('SELECT customer_id, name FROM Customer');
        return res.render('bookings/add', { title: 'Make a Booking', errors, customers, customer_id, date, time, activity_type });
    }

    try {
        // Insert the new booking into the database
        await db.query(
            'INSERT INTO Booking (customer_id, date, time, activity_type) VALUES (?, ?, ?, ?)',
            [customer_id, date, time, activity_type]
        );
        // Set a success message in the session and redirect to the bookings list
        req.session.message = { type: 'success', text: 'Booking added successfully!' };
        res.redirect('/bookings');
    } catch (error) {
        console.error(error);
        const [customers] = await db.query('SELECT customer_id, name FROM Customer');
        errors.push('Error adding booking');
        // If there's an error, re-render the form with error messages
        res.render('bookings/add', { title: 'Make a Booking', errors, customers, customer_id, date, time, activity_type });
    }
});

// Route to handle deleting a booking
router.post('/delete/:id', async (req, res) => {
    const bookingId = req.params.id;
    try {
        // Delete the booking from the database
        await db.query('DELETE FROM Booking WHERE booking_number = ?', [bookingId]);
        // Set a success message in the session
        req.session.message = { type: 'success', text: 'Booking deleted successfully!' };
    } catch (error) {
        console.error(error);
        // Set an error message in the session
        req.session.message = { type: 'error', text: 'Error deleting booking' };
    }
    // Redirect to the bookings list
    res.redirect('/bookings');
});

module.exports = router;