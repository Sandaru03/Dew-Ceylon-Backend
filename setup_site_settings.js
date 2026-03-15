import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const setup = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await db.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("site_settings table created/verified.");

    const [rows] = await db.query(
      "SELECT * FROM site_settings WHERE setting_key = 'featured_packages'"
    );
    if (rows.length === 0) {
      await db.query(
        "INSERT INTO site_settings (setting_key, setting_value) VALUES ('featured_packages', '[]')"
      );
      console.log("Default featured_packages setting inserted.");
    } else {
      console.log("featured_packages setting already exists.");
    }

    await db.end();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
};

setup();
