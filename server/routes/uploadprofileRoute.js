const verifyToken = require('../middlewares/verifyToken');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path"); // You need this to resolve file paths
const dotenv = require("dotenv");
const db = require("../utils/db");

// Load environmental variables
dotenv.config()

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory path
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    
    // Check if the directory exists
    fs.exists(uploadDir, (exists) => {
      if (!exists) {
        // Create the directory if it doesn't exist
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
          if (err) {
            return cb(err); // Handle directory creation error
          }
          return cb(null, uploadDir); // Proceed if directory creation is successful
        });
      } else {
        return cb(null, uploadDir); // If directory exists, use it
      }
    });
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage });

// Route to handle file upload
router.post('/uploadProfile', verifyToken, upload.single('file'), async (req, res) => {
  try {
    // Assuming 'decoded' is the user data from the token
    const studentId = req.userId; // Use 'req.userId' set in your verifyToken middleware

    //check if a profile picture already exists for the user
    const [existingProfilePic] = await db.query("SELECT profile_image FROM students WHERE student_id = ?", [studentId]);
    if (existingProfilePic.length > 0) {
      const oldProfilePic = existingProfilePic[0].profile_image;
      if (oldProfilePic) {
        // Delete the old profile picture file
        const oldFilePath = path.join(__dirname, '..', 'public', 'uploads', oldProfilePic);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old profile picture:", err);
          }
        });
      }
    }
    // 3. Save new image path in DB
    const newProfilePic = req.file.filename; // Get the new filename from multer
    await db.query("UPDATE students SET profile_image = ? WHERE student_id = ?", [newProfilePic, studentId]);

    console.log(req.body);
    console.log(req.file);

    // Respond with the uploaded file details
    res.status(200).json({
      message: "Profile picture uploaded successfully",
      imageUrl: `/uploads/${newProfilePic}`
    });
      } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ error: "Failed to upload profile picture" });
  }
});

module.exports = router;
