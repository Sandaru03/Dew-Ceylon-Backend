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

    console.log("Creating fleet_vehicles table...");
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS fleet_vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(255) NOT NULL,
        vehicle_type VARCHAR(255) NOT NULL,
        per_km VARCHAR(100) NOT NULL,
        max_person VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("fleet_vehicles table created successfully!");
    await db.end();
    process.exit(0);
  } catch (err) {
    console.error("Setup failed:", err.message);
    process.exit(1);
  }
};

setup();
