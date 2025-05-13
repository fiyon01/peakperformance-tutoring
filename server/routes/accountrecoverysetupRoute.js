const dotenv = require("dotenv");
const db = require("../utils/db");
const express = require("express");
const router = express.Router();

dotenv.config();

router.post("/accountRecovery-setup", async (req, res) => {
  try {
    const { token } = req.query;
    const { securityQuestion, answer, pin } = req.body;

    // Validate token format
    if (!token || token.length !== 32) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Check if token is valid and not expired
    const [rows] = await db.query(
      "SELECT * FROM students WHERE recovery_token = ? AND recovery_token_expires_at > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const studentId = rows[0].student_id;

    // Insert recovery details
    await db.query(
      "INSERT INTO account_recovery (student_id, security_question, answer, pin) VALUES (?, ?, ?, ?)",
      [studentId, securityQuestion, answer, pin]
    );

    // Clear the recovery token from student record
    await db.query(
      "UPDATE students SET recovery_token = NULL, recovery_token_expires_at = NULL WHERE student_id = ?",
      [studentId]
    );

    res.status(200).json({ message: "Account recovery details set successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while setting up account recovery." });
  }
});

module.exports = router;
