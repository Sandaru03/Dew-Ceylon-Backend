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
