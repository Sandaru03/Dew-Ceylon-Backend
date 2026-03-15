import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Seeding sample taxi packages...");
    
    const inclusionsPrivate = [
      "Private Air-Conditioned Car",
      "Professional English-Speaking driver",
      "Hotel Pickup & Drop",
      "Fuel & Highway Charges",
      "Parking Fees",
      "Complimentary Bottled Water",
      "Flexible Photo Stops on the way",
      "24/7 Support from Dew Ceylon Tours"
    ];

    const termsShared = [
      "Departure time may vary slightly depending on pickups",
      "Waiting time during hotel pickups possible",
      "No long sightseeing stops (transport only)",
      "Non-refundable if minimum passengers not reached"
    ];

    await db.query(`
      INSERT INTO taxi_packages (pickup, dropoff, type, price, pax, vehicle_type, inclusions, terms) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Negombo", "Sigiriya", "private", "LKR 16,000 – 20,000", "2 Persons", "Private Air-Conditioned Car", 
        JSON.stringify(inclusionsPrivate), JSON.stringify([])
      ]
    );

    await db.query(`
      INSERT INTO taxi_packages (pickup, dropoff, type, price, pax, vehicle_type, inclusions, terms) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Negombo", "Sigiriya", "shared", "LKR 5,000 – 7,000", "Per Person", "Comfortable AC Van (6–10 passengers)", 
        JSON.stringify(["Budget-Friendly Shared Ride"]), JSON.stringify(termsShared)
      ]
    );

    console.log("Sample taxi packages seeded successfully!");
    await db.end();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
