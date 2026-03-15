import db from "../config/db.js";

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query("SELECT * FROM blogs ORDER BY created_at DESC");
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error fetching blogs." });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const [blog] = await db.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    if (blog.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog[0]);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error fetching blog." });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, image, images, author, category, anchor, link } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    const [result] = await db.query(
      "INSERT INTO blogs (title, excerpt, content, image, images, author, category, anchor, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, excerpt, content, image, imagesJson, author || 'Ceyloria Team', category, anchor, link]
    );

    res.status(201).json({ id: result.insertId, message: "Blog created successfully" });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error creating blog." });
  }
};

// Update a blog
export const updateBlog = async (req, res) => {
  try {
    const { title, excerpt, content, image, images, author, category, anchor, link } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    const [result] = await db.query(
      "UPDATE blogs SET title=?, excerpt=?, content=?, image=?, images=?, author=?, category=?, anchor=?, link=? WHERE id=?",
      [title, excerpt, content, image, imagesJson, author, category, anchor, link, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error updating blog." });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM blogs WHERE id=?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error deleting blog." });
  }
};
