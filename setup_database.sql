CREATE DATABASE fit_kwick;
USE fit_kwick;

CREATE TABLE Customer (
                          customer_id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          address VARCHAR(255) NOT NULL,
                          membership_type ENUM('bronze', 'silver', 'gold') NOT NULL,
                          guest_passes INT DEFAULT 3
);

CREATE TABLE Booking (
                         booking_number INT AUTO_INCREMENT PRIMARY KEY,
                         date DATE NOT NULL,
                         time TIME NOT NULL,
                         customer_id INT,
                         activity_type ENUM('gym', 'swim') NOT NULL,
                         FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);
