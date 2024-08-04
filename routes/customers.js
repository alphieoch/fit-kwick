const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Route to list all customers
router.get('/', async (req, res) => {
    try {
        // Query the database to retrieve all customers
        const [rows] = await db.query('SELECT * FROM Customer');
        // Render the customers list view with the retrieved data
        res.render('customers/list', { title: 'Customer List', customers: rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving customers');
    }
});

// Route to show the add customer form
router.get('/add', (req, res) => {
    // Render the add customer form
    res.render('customers/add', { title: 'Add New Customer' });
});

// Route to handle adding a new customer
router.post('/add', async (req, res) => {
    const { name, address, membership_type } = req.body;
    const errors = [];

    // Validate form inputs
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }
    if (!address || address.trim() === '') {
        errors.push('Address is required');
    }
    if (!membership_type || !['bronze', 'silver', 'gold'].includes(membership_type)) {
        errors.push('Valid membership type is required');
    }

    // If there are validation errors, re-render the form with error messages
    if (errors.length > 0) {
        return res.render('customers/add', { title: 'Add New Customer', errors, name, address, membership_type });
    }

    try {
        // Insert the new customer into the database
        await db.query(
            'INSERT INTO Customer (name, address, membership_type) VALUES (?, ?, ?)',
            [name, address, membership_type]
        );
        // Set a success message in the session and redirect to the customers list
        req.session.message = { type: 'success', text: 'Customer added successfully!' };
        res.redirect('/customers');
    } catch (error) {
        console.error(error);
        errors.push('Error adding customer');
        // If there's an error, re-render the form with error messages
        res.render('customers/add', { title: 'Add New Customer', errors, name, address, membership_type });
    }
});

// Route to handle using a guest pass for a customer
router.post('/:id/use-guest-pass', async (req, res) => {
    const customerId = req.params.id;
    try {
        // Query the database to retrieve the guest pass count for the customer
        const [customer] = await db.query('SELECT guest_passes FROM Customer WHERE customer_id = ?', [customerId]);
        if (customer[0].guest_passes > 0) {
            // If the customer has available guest passes, decrement the count and set a success message
            await db.query('UPDATE Customer SET guest_passes = guest_passes - 1 WHERE customer_id = ?', [customerId]);
            req.session.message = { type: 'success', text: 'Guest pass used successfully!' };
        } else {
            // If the customer has no available guest passes, set an error message
            req.session.message = { type: 'error', text: 'No guest passes available' };
        }
        res.redirect('/customers');
    } catch (error) {
        console.error(error);
        // If there's an error, set an error message in the session
        req.session.message = { type: 'error', text: 'Error using guest pass' };
        res.redirect('/customers');
    }
});

// Route to handle deleting a customer
router.post('/delete/:id', async (req, res) => {
    const customerId = req.params.id;
    try {
        // Delete the customer from the database
        await db.query('DELETE FROM Customer WHERE customer_id = ?', [customerId]);
        // Set a success message in the session
        req.session.message = { type: 'success', text: 'Customer deleted successfully!' };
    } catch (error) {
        console.error(error);
        // Set an error message in the session
        req.session.message = { type: 'error', text: 'Error deleting customer' };
    }
    // Redirect to the customers list
    res.redirect('/customers');
});

module.exports = router;