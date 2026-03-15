import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const setup = async () => {
  try {
    // Initial connection to create database
    const initialConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Connected to MySQL server...");
    await initialConn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' checked/created.`);
    await initialConn.end();

    // Re-connect with the database context
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Creating tables...");
    
    // Create Admins Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'superadmin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Categories Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type ENUM('package', 'activity', 'blog') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Packages Table
    await db.query(`
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
        description TEXT,
        gallery JSON,
        locations JSON,
        inclusions JSON,
        exclusions JSON,
        highlights JSON,
        itinerary JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Activities Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        tagline VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        items JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Blogs Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT NOT NULL,
        images JSON,
        author VARCHAR(100) DEFAULT 'Ceyloria Team',
        category VARCHAR(100) NOT NULL,
        anchor VARCHAR(100) NOT NULL,
        link VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    const email = 'admin@dewceylon.com';
    const password = 'admin123';
    const name = 'Super Admin';
    const role = 'superadmin';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin exists
    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    
    if (rows.length > 0) {
      console.log("Superadmin already exists. Updating password...");
      await db.query("UPDATE admins SET password = ?, name = ? WHERE email = ?", [hashedPassword, name, email]);
    } else {
      console.log("Creating superadmin...");
      await db.query("INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role]);
    }

    console.log("-----------------------------------------");
    console.log("Admin Setup Complete!");
    console.log("Login Email: " + email);
    console.log("Login Password: " + password);
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (err) {
    console.error("Setup failed:", err.message);
    process.exit(1);
  }
};

setup();
