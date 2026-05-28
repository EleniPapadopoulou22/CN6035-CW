const pool = require('../config/db');

// Επιστρέφει τις θέσεις για ένα συγκεκριμένο showtime, μαζί με την διαθεσιμότητά τους
async function getSeatsByShowtime(showtimeId) {
  const [rows] = await pool.query(
    `SELECT
       s.seat_id,
       s.showtime_id,
       s.row_label,
       s.seat_number,
       s.category,
       CASE WHEN r.reservation_id IS NULL THEN TRUE ELSE FALSE END AS is_available,
       r.reservation_id
     FROM seats s
     LEFT JOIN reservations r ON s.seat_id = r.seat_id
     WHERE s.showtime_id = ?
     ORDER BY s.row_label, s.seat_number`,
    [showtimeId]
  );

  return rows;
}

module.exports = {
  getSeatsByShowtime,
};