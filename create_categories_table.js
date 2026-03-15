import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const createTable = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Creating categories table...");
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type ENUM('package', 'activity', 'blog') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert some default categories
    const initialCategories = [
      ['All Inclusive', 'package'],
      ['Safari', 'package'],
      ['Hiking', 'package'],
      ['Relax', 'package'],
      ['Culture', 'package'],
      ['Adventure', 'package'],
      ['Water Sports', 'activity'],
      ['Nature', 'activity'],
      ['Culture', 'activity'],
      ['Adventure', 'activity'],
      ['Travel Tips', 'blog'],
      ['Destinations', 'blog'],
      ['Culture', 'blog'],
      ['Wildlife', 'blog'],
    ];

    for (const [name, type] of initialCategories) {
        // check if exists
        const [rows] = await db.query('SELECT * FROM categories WHERE name = ? AND type = ?', [name, type]);
        if (rows.length === 0) {
            await db.query('INSERT INTO categories (name, type) VALUES (?, ?)', [name, type]);
        }
    }

    console.log("Categories table created and seeded.");
    await db.end();
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err.message);
    process.exit(1);
  }
};

createTable();
