# Fit Kwick Gym Management System

## Project Overview
Fit Kwick is a gym management system that helps fitness centers run their business. It lets gym staff add and remove customers, make bookings, and keep track of guest passes.

## Key Features
1. Customer Management
    * Add, view, and delete customers
    * Keep track of membership types (bronze, silver, gold)
2. Booking System
    * Make new bookings for gym or swim
    * View and delete bookings
3. Guest Pass Tracking
    * See how many guest passes each customer has used

## Technology Stack
* Backend: Node.js and Express.js
* Frontend: EJS
* Database: MySQL
* ORM: mysql2
* Styling: Custom CSS and Material-UI components

## Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fit-kwick.git
   cd fit-kwick
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the database:
    * Make sure MySQL is installed and running
    * Create a database called `fit_kwick`
    * Run `setup_database.sql` to create the tables
4. Configure the database connection:
    * Update the database information in `models/db.js`
5. Start the application:
   ```
   npm start
   ```
6. Go to `http://localhost:3000` in your web browser

## Data Model
Entity-Relationship Diagram
```
+-------------+      +-------------+
| Customer    |      | Booking     |
+-------------+      +-------------+
| customer_id |<-----| booking_num |
| name        |      | date        |
| address     |      | time        |
| member_type |      | customer_id |
| guest_passes|      | activity    |
+-------------+      +-------------+
```

## Database Details
1. Customer Table
    * `customer_id` (INT, Primary Key, Auto Increment)
    * `name` (VARCHAR(100), Not Null)
    * `address` (VARCHAR(255), Not Null)
    * `membership_type` (ENUM('bronze', 'silver', 'gold'), Not Null)
    * `guest_passes` (INT, Default 3)
2. Booking Table
    * `booking_number` (INT, Primary Key, Auto Increment)
    * `date` (DATE, Not Null)
    * `time` (TIME, Not Null)
    * `customer_id` (INT, Foreign Key referencing Customer.customer_id)
    * `activity_type` (ENUM('gym', 'swim'), Not Null)

Note: When a customer is deleted, all their bookings are deleted too because of the foreign key constraint on `customer_id`.

## Future Plans
1. Add user accounts for staff 
2. Move to react database
3. Let customers make their own bookings
3. Add a payment system for memberships
4. Make a dashboard
5. Create a mobile app
6. add more locations

## Contributors
* Alphonce Ochieng
