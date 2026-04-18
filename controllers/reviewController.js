import db from "../config/db.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new review (Admin)
export const createReview = async (req, res) => {
  const { name, role, rating, review_text, image } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO reviews (name, role, rating, review_text, image) VALUES (?, ?, ?, ?, ?)",
      [name, role, rating, review_text, image]
    );
    res.status(201).json({ message: "Review added successfully", insertId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a review (Admin)
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { name, role, rating, review_text, image } = req.body;
  try {
    await db.query(
      "UPDATE reviews SET name=?, role=?, rating=?, review_text=?, image=? WHERE id=?",
      [name, role, rating, review_text, image, id]
    );
    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a review (Admin)
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM reviews WHERE id=?", [id]);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
