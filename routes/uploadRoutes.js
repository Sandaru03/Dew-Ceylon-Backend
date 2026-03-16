import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const uploadToCloudinary = (fileBuffer, folderName = 'dew-ceylon') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folderName,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

router.post('/', upload.single('image'), async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary is not configured on the server' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer);

    return res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Image upload failed',
      error: error.message
    });
  }
});

export default router;
