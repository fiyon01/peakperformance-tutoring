const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

dotenv.config();


//function to get programs
const getPrograms =  async (req, res) => {
    try {
      const [programs] = await db.query(`
        SELECT id, name, year, term, duration, 
               DATE_FORMAT(start_date, '%b %d, %Y') as startDate,
               DATE_FORMAT(end_date, '%b %d, %Y') as endDate,
               is_active as isActive
        FROM programs 
        WHERE is_active = TRUE
        ORDER BY start_date DESC
      `);
  
      if (!programs) {
        throw new Error('No programs found');
      }
  
      res.status(200).json({ programs });
    } catch (err) {
      console.error('Error fetching programs:', err.message);
      res.status(500).json({ error: err.message || 'Failed to fetch programs' });
    }
  };


  // Get time slots for a specific program
const getTimeSlots = async (req, res) => {
    const { programId } = req.params;
  
    try {
      const [timeSlots] = await db.query(`
        SELECT pts.id, pts.day, pts.start_time as startTime, pts.end_time as endTime,
               s.id as subjectId, s.name as subjectName, s.teacher_name as teacherName
        FROM program_time_slots pts
        JOIN subjects s ON pts.subject_id = s.id
        WHERE pts.program_id = ?
        ORDER BY pts.day, pts.start_time
      `, [programId]);
  
      // Check if time slots are returned
      if (!timeSlots || timeSlots.length === 0) {
        throw new Error('No time slots found for this program.');
      }
  
      // Transform to match frontend structure
      const formattedSlots = timeSlots.map(slot => ({
        id: slot.id,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        subject: {
          id: slot.subjectId,
          name: slot.subjectName,
          teacher: slot.teacherName
        }
      }));
  
      res.status(200).json(formattedSlots);
    } catch (err) {
      console.error('Error fetching time slots:', err.message);
      res.status(500).json({ error: err.message || 'Failed to fetch time slots' });
    }
  };
  
  
  module.exports = { getPrograms, getTimeSlots };