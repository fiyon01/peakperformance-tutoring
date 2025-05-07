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
// GET /api/notifications - Fetch all notifications
router.get('/notifications', async (req, res) => {
    try {
      const notifications = await db.query(`
        SELECT id, type, title, preview, body, timestamp, 
               is_read, action_type, action_label, action_url, action_onClick
        FROM notifications
        ORDER BY timestamp DESC
      `);
      res.json({notifications});
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });
// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/notifications/:id/read',verifyToken, async (req, res) => {
    try {
      await db.query(`
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ?
      `, [req.params.id]);
  
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });
  
  // PATCH /api/notifications/mark-all-read - Mark all notifications as read
  router.patch('/notifications/mark-all-read',verifyToken, async (req, res) => {
    try {
      await db.query(`
        UPDATE notifications
        SET is_read = TRUE
        WHERE is_read = FALSE
      `);
  
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  });
  
  // DELETE /api/notifications/:id - Archive notification
  router.delete('/notifications/:id',verifyToken, async (req, res) => {
    try {
      await db.query(`
        DELETE FROM notifications
        WHERE id = ?
      `, [req.params.id]);
  
      res.status(200).json({ message: 'Notification archived' });
    } catch (error) {
      console.error('Error archiving notification:', error);
      res.status(500).json({ error: 'Failed to archive notification' });
    }
  });
  

  module.exports = router