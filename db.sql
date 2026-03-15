-- Create Database
CREATE DATABASE IF NOT EXISTS dew_ceylon_db;
USE dew_ceylon_db;

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages Table
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    originalPrice VARCHAR(50),
    rating DECIMAL(2,1) DEFAULT 0.0,
    bookings VARCHAR(50),
    type VARCHAR(100),
    image TEXT,
    short_description TEXT,
    description TEXT,
    gallery JSON, -- Store array of image URLs
    locations JSON, -- Store array of locations
    inclusions JSON, -- Store array of inclusions
    exclusions JSON, -- Store array of exclusions
    highlights JSON, -- Store 'Why travelers love this'
    itinerary JSON, -- Store day-by-day JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inset Initial Admin (Password: admin123 - hashed version will be set via setup script)
-- NOTE: This is just a placeholder, the actual insertion should happen with bcyrpt hashed password.
INSERT IGNORE INTO admins (name, email, password, role) 
VALUES ('Super Admin', 'admin@dewceylon.com', '$2a$10$XmS/r0H.1Y6/H9c.z6XjOuM6U3v2v7x7x7x7x7x7x7x7x', 'superadmin');
