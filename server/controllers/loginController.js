const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

dotenv.config();

const loginStudents = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const [existing] = await db.query("SELECT * FROM students WHERE username = ?", [username]);
    if (existing.length > 0) {
      const user = existing[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isUser: true },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // --- Capture IP and Device Info ---
      const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      // --- Optional: Insert login notification ---
      await db.query(
        `INSERT INTO notifications (type, title, preview, body, timestamp, action_type, action_label, action_url) 
         VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)`,
        [
          "security",
          `Login Detected`,
          `Login from IP: ${ipAddress}`,
          `A new login to your account was detected.\nDevice: ${userAgent}`,
          "link",
          "View Activity",
          "/student/activity" // Or wherever your activity log is
        ]
      );

      // --- Optional: Log to a login_logs table ---
      await db.query(
        `INSERT INTO login_logs (student_id, ip_address, user_agent) VALUES (?, ?, ?)`,
        [user.id, ipAddress, userAgent]
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          username: user.username,
          regNumber: user.registration_number,
          studentname: user.full_name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          grade: user.grade_level
        }
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Login failed" });
  }
};

module.exports = { loginStudents };
