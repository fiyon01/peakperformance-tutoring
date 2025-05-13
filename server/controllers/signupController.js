const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");
const crypto = require("crypto");
dotenv.config();



async function generateRegistrationNumber() {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM students");
    const total = rows[0].total + 1;
    const year = new Date().getFullYear();
    return `PPT${year}${String(total).padStart(4, "0")}`;
  } catch (error) {
    throw new Error("Failed to generate registration number");
  }
}

const signupStudents = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      password,
      phone,
      gradeLevel,
      schoolName,
      address,
      parents,
    } = req.body;

    if (!fullName || !username || !password || !gradeLevel || !schoolName || !address || !parents) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const [existing] = await db.query("SELECT * FROM students WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const registrationNumber = await generateRegistrationNumber();

    const [insertResult] = await db.query(
      `INSERT INTO students 
        (registration_number, full_name, email, username, password,phone, grade_level, school_name, address,
         mother_name, mother_phone, mother_email,
         father_name, father_phone, father_email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationNumber,
        fullName,
        email,
        username,
        hashedPassword,
        phone,
        gradeLevel,
        schoolName,
        address,
        parents[0]?.name || "",
        parents[0]?.phone || "",
        parents[0]?.email || "",
        parents[1]?.name || "",
        parents[1]?.phone || "",
        parents[1]?.email || "",
      ]
    );

    if (!insertResult || insertResult.affectedRows === 0) {
      throw new Error("Failed to insert new student");
    }
    const studentId = insertResult.insertId;
    const recoveryToken = crypto.randomBytes(16).toString("hex"); 
    // Set expiration time to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in ms

    // Save token and expiration to DB
    await db.query(
      "UPDATE students SET recovery_token = ?, recovery_token_expires_at = ? WHERE student_id = ?",
      [recoveryToken, expiresAt, studentId]
    );

    return res.status(201).json({ token: recoveryToken });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Signup failed" });
  }
};

module.exports = { signupStudents };
