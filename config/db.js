import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
db.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL Database");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

export default db;
