const dotenv = require("dotenv");
const db = require("../utils/db");
const express = require("express")
const router = express.Router()

dotenv.config();


router.post('/api/ratings', async (req, res) => {
    const { name, email, phone, rating, testimonialText, userType } = req.body;
  
    // Input validation
    if (!name || !email || !testimonialText || !userType) {
      throw new Error("Missing required fields: name, email, testimonial, or userType.");
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error("Invalid email format.");
    }
  
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new Error("Rating must be a number between 1 and 5.");
    }
  
    try {
      const query = `
        INSERT INTO testimonials (name, email, phone, rating, testimonial, user_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [name, email, phone, rating, testimonialText, userType];
      await db.query(query, values);
  
      res.status(201).json({ message: "Rating submitted successfully!" });
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  });
  
  module.exports = router;