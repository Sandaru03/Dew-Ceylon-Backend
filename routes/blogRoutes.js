import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", createBlog); // Consider adding auth middleware here later
router.put("/:id", updateBlog); // Consider adding auth middleware here later
router.delete("/:id", deleteBlog); // Consider adding auth middleware here later

export default router;
