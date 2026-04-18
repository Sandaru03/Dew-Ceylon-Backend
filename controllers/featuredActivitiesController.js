import db from "../config/db.js";

const ensureSiteSettingsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

// GET featured activity IDs (returns array of up to 4 activity objects)
export const getFeaturedActivities = async (req, res) => {
  try {
    await ensureSiteSettingsTable();
    const [rows] = await db.query(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'featured_activities'"
    );
    if (rows.length === 0) return res.json([]);

    const ids = JSON.parse(rows[0].setting_value);
    if (!ids || ids.length === 0) return res.json([]);

    // Normalize to objects
    const items = typeof ids[0] === 'object' ? ids : ids.map(id => ({ id, discount: null }));
    const idArray = items.map(item => item.id);
    if (!idArray || idArray.length === 0) return res.json([]);

    const placeholders = idArray.map(() => '?').join(',');
    const [activities] = await db.query(
      `SELECT * FROM activities WHERE id IN (${placeholders})`,
      idArray
    );

    // Re-order to match the saved order and attach discount
    const ordered = items
      .map(item => {
        const act = activities.find(a => a.id === item.id);
        if (act) act.discount = item.discount;
        return act;
      })
      .filter(act => act);

    res.json(ordered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET just the featured IDs (for the admin selector)
export const getFeaturedActivityIds = async (req, res) => {
  try {
    await ensureSiteSettingsTable();
    const [rows] = await db.query(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'featured_activities'"
    );
    const ids = rows.length > 0 ? JSON.parse(rows[0].setting_value) : [];
    const items = ids.map(item => typeof item === 'object' ? item : { id: item, discount: null });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT save featured activity IDs (array of up to 4 IDs)
export const saveFeaturedActivities = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length > 4) {
    return res.status(400).json({ message: "Provide an array of up to 4 activity items" });
  }
  try {
    await ensureSiteSettingsTable();
    await db.query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES ('featured_activities', ?)
       ON DUPLICATE KEY UPDATE setting_value = ?`,
      [JSON.stringify(ids), JSON.stringify(ids)]
    );
    res.json({ message: "Featured activities saved", ids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
