import db from "../config/db.js";

// Get all fleet vehicles
export const getFleetVehicles = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM fleet_vehicles ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new fleet vehicle
export const createFleetVehicle = async (req, res) => {
  const { image, vehicle_type, per_km, max_person } = req.body;
  
  if (!image || !vehicle_type || !per_km || !max_person) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO fleet_vehicles (image, vehicle_type, per_km, max_person) 
       VALUES (?, ?, ?, ?)`,
      [image, vehicle_type, per_km, max_person]
    );
    res.status(201).json({ id: result.insertId, message: "Fleet vehicle created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing fleet vehicle
export const updateFleetVehicle = async (req, res) => {
  const { id } = req.params;
  const { image, vehicle_type, per_km, max_person } = req.body;

  if (!image || !vehicle_type || !per_km || !max_person) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      `UPDATE fleet_vehicles
       SET image = ?, vehicle_type = ?, per_km = ?, max_person = ?
       WHERE id = ?`,
      [image, vehicle_type, per_km, max_person, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Fleet vehicle not found" });
    }

    res.json({ message: "Fleet vehicle updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a fleet vehicle
export const deleteFleetVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM fleet_vehicles WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
       return res.status(404).json({ message: "Fleet vehicle not found" });
    }
    res.json({ message: "Fleet vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
