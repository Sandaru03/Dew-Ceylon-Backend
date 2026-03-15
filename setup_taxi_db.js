import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const setup = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Creating taxi_packages table...");
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS taxi_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pickup VARCHAR(255) NOT NULL,
        dropoff VARCHAR(255) NOT NULL,
        type ENUM('private', 'shared') NOT NULL,
        price VARCHAR(100) NOT NULL,
        pax VARCHAR(100),
        vehicle_type VARCHAR(255),
        inclusions JSON,
        terms JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("taxi_packages table created successfully!");
    await db.end();
    process.exit(0);
  } catch (err) {
    console.error("Setup failed:", err.message);
    process.exit(1);
  }
};

setup();
