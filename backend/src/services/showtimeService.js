const pool = require('../config/db');

// Επιστρέφει όλα τα showtimes, με δυνατότητα φιλτραρίσματος κατά show ή ημερομηνία
async function getShowtimes(filters = {}) {
  let query = `
    SELECT
      st.showtime_id,
      st.show_id,
      st.start_datetime,
      st.hall,
      st.price,
      s.title AS show_title,
      s.duration_minutes,
      s.age_rating,
      t.name AS theatre_name,
      t.location AS theatre_location
    FROM showtimes st
    INNER JOIN shows s ON st.show_id = s.show_id
    INNER JOIN theatres t ON s.theatre_id = t.theatre_id
  `;

  const conditions = [];
  const params = [];

  if (filters.showId) {
    conditions.push('st.show_id = ?');
    params.push(filters.showId);
  }

  if (filters.date) {
    conditions.push('DATE(st.start_datetime) = ?');
    params.push(filters.date);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY st.start_datetime';

  const [rows] = await pool.query(query, params);
  return rows;
}

async function getShowtimeById(showtimeId) {
  const [rows] = await pool.query(
    `SELECT
       st.showtime_id,
       st.show_id,
       st.start_datetime,
       st.hall,
       st.price,
       s.title AS show_title,
       s.duration_minutes,
       s.age_rating,
       t.name AS theatre_name,
       t.location AS theatre_location
     FROM showtimes st
     INNER JOIN shows s ON st.show_id = s.show_id
     INNER JOIN theatres t ON s.theatre_id = t.theatre_id
     WHERE st.showtime_id = ?`,
    [showtimeId]
  );

  return rows[0] || null;
}

module.exports = {
  getShowtimes,
  getShowtimeById,
};