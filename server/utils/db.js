const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cron = require("node-cron");

dotenv.config();

// Create a database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection at startup
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to database");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:", err);
    throw new Error(err);
  }
})();

// Schedule a cron job to update program statuses every day at midnight
cron.schedule("0 0 * * *", async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

    // Deactivate completed programs
    await connection.execute(
      `UPDATE programs SET is_active = FALSE WHERE end_date < CURDATE() AND is_active = TRUE`
    );
    console.log("Deactivated completed programs");

    // Activate programs that have started today or are ongoing
    await connection.execute(
      `UPDATE programs SET is_active = TRUE WHERE start_date <= CURDATE() AND end_date >= CURDATE() AND is_active = FALSE`
    );
    console.log("Activated ongoing programs");
  } catch (err) {
    console.error("Error updating program statuses:", err);
    throw new Error(err)
  } finally {
    await connection.end();
  }
});

module.exports = db;
