import db from "../config/db.js";

export const getAllPackages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM packages");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM packages WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Package not found" });
    res.json(rows[0]);
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
        title, category, duration, price, originalPrice, 
        rating, bookings, type, image, shortDescription, description, 
        JSON.stringify(gallery), JSON.stringify(locations), 
        JSON.stringify(inclusions), JSON.stringify(exclusions), 
        JSON.stringify(highlights), JSON.stringify(itinerary)
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
        title, category, duration, price, originalPrice, 
        rating, bookings, type, image, shortDescription, description, 
        JSON.stringify(gallery), JSON.stringify(locations), 
        JSON.stringify(inclusions), JSON.stringify(exclusions), 
        JSON.stringify(highlights), JSON.stringify(itinerary),
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
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
