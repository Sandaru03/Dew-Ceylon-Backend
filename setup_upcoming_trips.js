import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const createUpcomingTripsTable = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to database...");

    await db.query(`
      CREATE TABLE IF NOT EXISTS upcoming_trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(50) DEFAULT NULL,
        image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("upcoming_trips table created/verified successfully.");
    await db.end();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
};

createUpcomingTripsTable();
