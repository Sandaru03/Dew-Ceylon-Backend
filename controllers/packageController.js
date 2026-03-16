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
  try {
    await ensureSiteSettingsTable();
    const [rows] = await db.query(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'hidden_packages'"
    );
    if (rows.length === 0) return [];

    const parsed = JSON.parse(rows[0].setting_value || '[]');
    return Array.isArray(parsed)
      ? parsed.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
      : [];
  } catch (error) {
    if (error?.code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    throw error;
  }
};

const saveHiddenPackageIds = async (ids) => {
  await ensureSiteSettingsTable();
  await db.query(
    `INSERT INTO site_settings (setting_key, setting_value)
     VALUES ('hidden_packages', ?)
     ON DUPLICATE KEY UPDATE setting_value = ?`,
    [JSON.stringify(ids), JSON.stringify(ids)]
  );
};

const mapPackageWithLiveFlag = (pkg, hiddenIdsSet) => ({
  ...pkg,
  is_live: !hiddenIdsSet.has(pkg.id)
});

export const getAllPackages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM packages ORDER BY id DESC");
    const includeHidden = req.query.includeHidden === 'true';
    const hiddenIds = await getHiddenPackageIds();
    const hiddenSet = new Set(hiddenIds);

    const withStatus = rows.map((pkg) => mapPackageWithLiveFlag(pkg, hiddenSet));
    const visible = includeHidden ? withStatus : withStatus.filter((pkg) => pkg.is_live);

    res.json(visible);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM packages WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Package not found" });

    const includeHidden = req.query.includeHidden === 'true';
    const hiddenIds = await getHiddenPackageIds();
    const isHidden = hiddenIds.includes(Number(id));
    if (isHidden && !includeHidden) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({
      ...rows[0],
      is_live: !isHidden
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPackage = async (req, res) => {
  const { 
    title, category, duration, price, originalPrice, 
    rating, bookings, type, image, shortDescription, description, 
    gallery, locations, inclusions, exclusions, highlights, itinerary 
  } = req.body;
  
  try {
    const [result] = await db.query(
      `INSERT INTO packages (
        title, category, duration, price, originalPrice, 
        rating, bookings, type, image, short_description, description, 
        gallery, locations, inclusions, exclusions, highlights, itinerary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title !== undefined ? title : null, 
        category !== undefined ? category : null, 
        duration !== undefined ? duration : null, 
        price !== undefined ? price : null, 
        originalPrice !== undefined ? originalPrice : null, 
        rating !== undefined ? rating : 0.0, 
        bookings !== undefined ? bookings : null, 
        type !== undefined ? type : null, 
        image !== undefined ? image : null, 
        shortDescription !== undefined ? shortDescription : null, 
        description !== undefined ? description : null, 
        JSON.stringify(gallery || []), 
        JSON.stringify(locations || []), 
        JSON.stringify(inclusions || []), 
        JSON.stringify(exclusions || []), 
        JSON.stringify(highlights || []), 
        JSON.stringify(itinerary || [])
      ]
    );
    res.status(201).json({ id: result.insertId, message: "Package created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { 
    title, category, duration, price, originalPrice, 
    rating, bookings, type, image, shortDescription, description, 
    gallery, locations, inclusions, exclusions, highlights, itinerary 
  } = req.body;

  try {
    await db.query(
      `UPDATE packages SET 
        title = ?, category = ?, duration = ?, price = ?, originalPrice = ?, 
        rating = ?, bookings = ?, type = ?, image = ?, short_description = ?, description = ?, 
        gallery = ?, locations = ?, inclusions = ?, exclusions = ?, highlights = ?, itinerary = ?
      WHERE id = ?`,
      [
        title !== undefined ? title : null, 
        category !== undefined ? category : null, 
        duration !== undefined ? duration : null, 
        price !== undefined ? price : null, 
        originalPrice !== undefined ? originalPrice : null, 
        rating !== undefined ? rating : 0.0, 
        bookings !== undefined ? bookings : null, 
        type !== undefined ? type : null, 
        image !== undefined ? image : null, 
        shortDescription !== undefined ? shortDescription : null, 
        description !== undefined ? description : null, 
        JSON.stringify(gallery || []), 
        JSON.stringify(locations || []), 
        JSON.stringify(inclusions || []), 
        JSON.stringify(exclusions || []), 
        JSON.stringify(highlights || []), 
        JSON.stringify(itinerary || []),
        id
      ]
    );
    res.json({ message: "Package updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM packages WHERE id = ?", [id]);

    const hiddenIds = await getHiddenPackageIds();
    const nextHiddenIds = hiddenIds.filter((hiddenId) => hiddenId !== Number(id));
    if (nextHiddenIds.length !== hiddenIds.length) {
      await saveHiddenPackageIds(nextHiddenIds);
    }

    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePackageLiveStatus = async (req, res) => {
  const { id } = req.params;
  const { isLive } = req.body;

  if (typeof isLive !== 'boolean') {
    return res.status(400).json({ message: "isLive boolean is required" });
  }

  try {
    const [rows] = await db.query("SELECT id FROM packages WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    const packageId = Number(id);
    const hiddenIds = await getHiddenPackageIds();
    const hiddenSet = new Set(hiddenIds);

    if (isLive) {
      hiddenSet.delete(packageId);
    } else {
      hiddenSet.add(packageId);
    }

    const nextHiddenIds = Array.from(hiddenSet);
    await saveHiddenPackageIds(nextHiddenIds);

    res.json({
      message: `Package marked as ${isLive ? 'Live' : 'Hidden'}`,
      id: packageId,
      is_live: isLive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
