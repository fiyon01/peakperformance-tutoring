const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");
const express = require("express")
const router = express.Router()

dotenv.config();


//function to verify JWT token
// This function checks if the token is valid and not expired
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      req.userId = decoded.id;
      next();
    });
  };

  router.get("/user/me", verifyToken, async (req, res) => {
    const studentId = req.userId;
    try {
      db.query("SELECT * FROM studets WHERE student_id = ?", [studentId], (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(results[0]); // ✅ just return the user
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  module.exports = router

