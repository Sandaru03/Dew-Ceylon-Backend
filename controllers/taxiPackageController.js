import db from "../config/db.js";

export const getAllTaxiPackages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM taxi_packages ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTaxiPackages = async (req, res) => {
  const { pickup, dropoff } = req.query;
  try {
    const [rows] = await db.query(
      "SELECT * FROM taxi_packages WHERE LOWER(pickup) = LOWER(?) AND LOWER(dropoff) = LOWER(?)",
      [pickup, dropoff]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUniqueLocations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT pickup as location FROM taxi_packages
      UNION
      SELECT DISTINCT dropoff as location FROM taxi_packages
    `);
    const locations = rows.map(row => row.location).filter(loc => loc);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCapacities = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT pax FROM taxi_packages");
    const capacities = rows.map(row => row.pax).filter(pax => pax);
    res.json(capacities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehiclesByCapacity = async (req, res) => {
  const { pax } = req.query;
  try {
    const [rows] = await db.query("SELECT DISTINCT vehicle_type FROM taxi_packages WHERE pax = ?", [pax]);
    const vehicles = rows.map(row => row.vehicle_type).filter(v => v);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTaxiPackage = async (req, res) => {
  const { pickup, dropoff, type, price, pax, vehicle_type, inclusions, terms } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO taxi_packages (pickup, dropoff, type, price, pax, vehicle_type, inclusions, terms) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [pickup, dropoff, type, price, pax, vehicle_type, JSON.stringify(inclusions), JSON.stringify(terms)]
    );
    res.status(201).json({ id: result.insertId, message: "Taxi package created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaxiPackage = async (req, res) => {
  const { id } = req.params;
  const { pickup, dropoff, type, price, pax, vehicle_type, inclusions, terms } = req.body;
  try {
    await db.query(
      `UPDATE taxi_packages SET pickup = ?, dropoff = ?, type = ?, price = ?, pax = ?, vehicle_type = ?, inclusions = ?, terms = ? 
       WHERE id = ?`,
      [pickup, dropoff, type, price, pax, vehicle_type, JSON.stringify(inclusions), JSON.stringify(terms), id]
    );
    res.json({ message: "Taxi package updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTaxiPackage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM taxi_packages WHERE id = ?", [id]);
    res.json({ message: "Taxi package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
