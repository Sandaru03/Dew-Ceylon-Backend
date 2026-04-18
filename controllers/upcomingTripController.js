import db from "../config/db.js";

export const getAllUpcomingTrips = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM upcoming_trips ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUpcomingTrip = async (req, res) => {
  const { title, price, image } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO upcoming_trips (title, price, image) VALUES (?, ?, ?)",
      [title, price || null, image]
    );
    res.status(201).json({ id: result.insertId, message: "Trip created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUpcomingTrip = async (req, res) => {
  const { id } = req.params;
  const { title, price, image } = req.body;
  try {
    await db.query(
      "UPDATE upcoming_trips SET title = ?, price = ?, image = ? WHERE id = ?",
      [title, price || null, image, id]
    );
    res.json({ message: "Trip updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUpcomingTrip = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM upcoming_trips WHERE id = ?", [id]);
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ensureSiteSettingsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export const getUpcomingTripsToggle = async (req, res) => {
  try {
    await ensureSiteSettingsTable();
    const [rows] = await db.query(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'upcoming_trips_enabled'"
    );
    if (rows.length === 0) return res.json({ enabled: true }); // default to true
    
    // value might be stored as "true" or "false" string, or JSON boolean
    const enabled = rows[0].setting_value === 'true';
    res.json({ enabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUpcomingTripsToggle = async (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ message: "Provide a boolean 'enabled' attribute" });
  }
  try {
    await ensureSiteSettingsTable();
    await db.query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES ('upcoming_trips_enabled', ?)
       ON DUPLICATE KEY UPDATE setting_value = ?`,
      [enabled ? 'true' : 'false', enabled ? 'true' : 'false']
    );
    res.json({ message: "Toggle status saved", enabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
