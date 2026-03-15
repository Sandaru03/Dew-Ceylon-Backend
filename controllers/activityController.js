import db from "../config/db.js";

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const [activities] = await db.query("SELECT * FROM activities ORDER BY created_at DESC");
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Server error fetching activities." });
  }
};

// Get single activity by ID
export const getActivityById = async (req, res) => {
  try {
    const [activity] = await db.query("SELECT * FROM activities WHERE id = ?", [req.params.id]);
    if (activity.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json(activity[0]);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Server error fetching activity." });
  }
};

// Create a new activity
export const createActivity = async (req, res) => {
  try {
    const { title, category, image, tagline, description, items } = req.body;
    const itemsJson = items ? JSON.stringify(items) : null;

    const [result] = await db.query(
      "INSERT INTO activities (title, category, image, tagline, description, items) VALUES (?, ?, ?, ?, ?, ?)",
      [title, category, image, tagline, description, itemsJson]
    );

    res.status(201).json({ id: result.insertId, message: "Activity created successfully" });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ message: "Server error creating activity." });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  try {
    const { title, category, image, tagline, description, items } = req.body;
    const itemsJson = items ? JSON.stringify(items) : null;

    const [result] = await db.query(
      "UPDATE activities SET title=?, category=?, image=?, tagline=?, description=?, items=? WHERE id=?",
      [title, category, image, tagline, description, itemsJson, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity updated successfully" });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ message: "Server error updating activity." });
  }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM activities WHERE id=?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ message: "Server error deleting activity." });
  }
};
