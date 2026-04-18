import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
  try {
    const db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dew_ceylon_db',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    const connection = await db.getConnection();
    console.log("Connected successfully!");
    const [rows] = await connection.query("SHOW TABLES");
    console.log("Tables:", rows);
    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}
testConnection();
