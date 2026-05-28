const pool = require('../config/db');

// Εμφανίζει όλα τα shows, με δυνατότητα φιλτραρίσματος κατά θέατρο ή τίτλο
async function getShows(filters = {}) {
  let query = `
    SELECT
      s.show_id,
      s.theatre_id,
      s.title,
      s.description,
      s.duration_minutes,
      s.age_rating,
      t.name AS theatre_name,
      t.location AS theatre_location
    FROM shows s
    INNER JOIN theatres t ON s.theatre_id = t.theatre_id
  `;

  const conditions = [];
  const params = [];

  if (filters.theatreId) {
    conditions.push('s.theatre_id = ?');
    params.push(filters.theatreId);
  }

  if (filters.title) {
    conditions.push('s.title LIKE ?');
    params.push(`%${filters.title}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY s.title';

  const [rows] = await pool.query(query, params);
  return rows;
}

async function getShowById(showId) {
  const [rows] = await pool.query(
    `SELECT
       s.show_id,
       s.theatre_id,
       s.title,
       s.description,
       s.duration_minutes,
       s.age_rating,
       t.name AS theatre_name,
       t.location AS theatre_location
     FROM shows s
     INNER JOIN theatres t ON s.theatre_id = t.theatre_id
     WHERE s.show_id = ?`,
    [showId]
  );

  return rows[0] || null;
}

module.exports = {
  getShows,
  getShowById,
};