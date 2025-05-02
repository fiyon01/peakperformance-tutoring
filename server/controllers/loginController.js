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
  
      // Check if the user exists
      const [existing] = await db.query("SELECT * FROM students WHERE username = ?", [username]);
      if (existing.length > 0) {
        const user = existing[0];
  
        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid password" });
        }
  
        // After successful login, generate JWT token with isNewUser as false
        const token = jwt.sign(
          { id: user.id, username: user.username, isUser: true },  // isNewUser is false for existing users
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
  
        return res.status(200).json({
          message: "Login successful",
          token,
          user: { username: user.username, regNumber: user.registration_number, studentname: user.full_name, email:user.email, phone:user.phone,address:user.address,grade:user.grade_level }
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
