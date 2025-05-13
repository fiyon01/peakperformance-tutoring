const verifyToken = require('../middlewares/verifyToken');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const db = require("../utils/db");

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

    fs.exists(uploadDir, (exists) => {
      if (!exists) {
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating upload directory:", err);
            return cb(new Error("Failed to create upload directory"));
          }
          return cb(null, uploadDir);
        });
      } else {
        return cb(null, uploadDir);
      }
    });
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Optional: restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(file.mimetype);
  if (isValid) cb(null, true);
  else cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
};

const upload = multer({ storage, fileFilter });

// POST /uploadProfile
router.post('/uploadProfile', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const studentId = req.userId;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check for existing profile image
    const [existingProfilePic] = await db.query(
      "SELECT profile_image FROM students WHERE student_id = ?",
      [studentId]
    );

    if (existingProfilePic.length > 0) {
      const oldProfilePic = existingProfilePic[0].profile_image;
      if (oldProfilePic) {
        const oldFilePath = path.join(__dirname, '..', 'public', 'uploads', oldProfilePic);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.warn("Old profile picture not deleted:", err.message);
          }
        });
      }
    }

    // Save new profile image in DB
    const newProfilePic = req.file.filename;
    await db.query(
      "UPDATE students SET profile_image = ? WHERE student_id = ?",
      [newProfilePic, studentId]
    );

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      imageUrl: `/uploads/${newProfilePic}`,
    });

  } catch (error) {
    console.error("Upload error:", error.message || error);
    return res.status(500).json({ error: "An error occurred during upload. Please try again." });
  }
});

module.exports = router;
