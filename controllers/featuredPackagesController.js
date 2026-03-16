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

const getHiddenPackageIds = async () => {
  await ensureSiteSettingsTable();
  const [rows] = await db.query(
    "SELECT setting_value FROM site_settings WHERE setting_key = 'hidden_packages'"
  );
  if (rows.length === 0) return [];

  const parsed = JSON.parse(rows[0].setting_value || '[]');
  return Array.isArray(parsed)
    ? parsed.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : [];
};

// GET featured package IDs (returns array of up to 4 package objects)
export const getFeaturedPackages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'featured_packages'"
    );
    if (rows.length === 0) return res.json([]);

    const ids = JSON.parse(rows[0].setting_value);
    if (!ids || ids.length === 0) return res.json([]);

    // Fetch the actual package data for the selected IDs (preserve order)
    const placeholders = ids.map(() => '?').join(',');
    const [packages] = await db.query(
      `SELECT * FROM packages WHERE id IN (${placeholders})`,
      ids
    );

    const hiddenIds = await getHiddenPackageIds();
    const hiddenSet = new Set(hiddenIds);

    // Re-order to match the saved order
    const ordered = ids
      .map(id => packages.find(p => p.id === id))
      .filter((pkg) => pkg && !hiddenSet.has(pkg.id));

    res.json(ordered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET just the featured IDs (for the admin selector)
export const getFeaturedIds = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'featured_packages'"
    );
    const ids = rows.length > 0 ? JSON.parse(rows[0].setting_value) : [];
    res.json(ids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT save featured package IDs (array of up to 4 IDs)
export const saveFeaturedPackages = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length > 4) {
    return res.status(400).json({ message: "Provide an array of up to 4 package IDs" });
  }
  try {
    await db.query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES ('featured_packages', ?)
       ON DUPLICATE KEY UPDATE setting_value = ?`,
      [JSON.stringify(ids), JSON.stringify(ids)]
    );
    res.json({ message: "Featured packages saved", ids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
