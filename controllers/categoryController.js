import db from "../config/db.js";

// @desc    Get all categories or by type
// @route   GET /api/categories
// @access  Public (for fetching)
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = "SELECT * FROM categories";
    let params = [];
    
    if (type) {
      query += " WHERE type = ?";
      params.push(type);
    }
    
    query += " ORDER BY name ASC";
    
    const [categories] = await db.query(query, params);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching categories", error: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }
    
    // Check if category exists for this type
    const [existing] = await db.query("SELECT * FROM categories WHERE name = ? AND type = ?", [name, type]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Category with this name already exists for this type" });
    }
    
    const [result] = await db.query("INSERT INTO categories (name, type) VALUES (?, ?)", [name, type]);
    
    res.status(201).json({ id: result.insertId, name, type });
  } catch (error) {
    res.status(500).json({ message: "Server error creating category", error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    
    const [result] = await db.query("UPDATE categories SET name = ?, type = ? WHERE id = ?", [name, type, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ id, name, type });
  } catch (error) {
    res.status(500).json({ message: "Server error updating category", error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting category", error: error.message });
  }
};
