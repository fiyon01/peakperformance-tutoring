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

    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = existing[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.student_id, username: user.username, isUser: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    await db.query(
      "INSERT INTO login_logs (student_id, ip_address, user_agent) VALUES (?, ?, ?)",
      [user.student_id, ipAddress, userAgent]
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
        grade: user.grade_level,
        profile_image :user.profile_image // return full image path
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { loginStudents };
