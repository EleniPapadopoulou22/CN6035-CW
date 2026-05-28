const pool = require('../config/db');

// Δημιουργεί μια νέα κράτηση μέσα σε μια συναλλαγή
// SELECT ... FOR UPDATE αποτρέπει δυο χρήστες να κρατήσουν το ίδιο κάθισμα ταυτόχρονα
async function createReservation(userId, seatId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [seatRows] = await connection.query(
      'SELECT seat_id FROM seats WHERE seat_id = ? FOR UPDATE',
      [seatId]
    );

    if (seatRows.length === 0) {
      throw new Error('SEAT_NOT_FOUND');
    }

    const [existingReservations] = await connection.query(
      'SELECT reservation_id FROM reservations WHERE seat_id = ?',
      [seatId]
    );

    if (existingReservations.length > 0) {
      throw new Error('SEAT_ALREADY_RESERVED');
    }

    const [result] = await connection.query(
      'INSERT INTO reservations (user_id, seat_id) VALUES (?, ?)',
      [userId, seatId]
    );

    await connection.commit();

    return {
      reservation_id: result.insertId,
      user_id: userId,
      seat_id: seatId,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Επιστρέφει το ιστορικό κρατήσεων του logged-in χρήστη
async function getUserReservations(userId) {
  const [rows] = await pool.query(
    `SELECT
       r.reservation_id,
       r.created_at,
       s.seat_id,
       s.row_label,
       s.seat_number,
       s.category,
       st.showtime_id,
       st.start_datetime,
       st.hall,
       st.price,
       sh.show_id,
       sh.title AS show_title,
       t.theatre_id,
       t.name AS theatre_name,
       t.location AS theatre_location
     FROM reservations r
     INNER JOIN seats s ON r.seat_id = s.seat_id
     INNER JOIN showtimes st ON s.showtime_id = st.showtime_id
     INNER JOIN shows sh ON st.show_id = sh.show_id
     INNER JOIN theatres t ON sh.theatre_id = t.theatre_id
     WHERE r.user_id = ?
     ORDER BY st.start_datetime DESC`,
    [userId]
  );

  return rows;
}

async function deleteReservation(reservationId, userId) {
  const [rows] = await pool.query(
    `SELECT
       r.reservation_id,
       st.start_datetime
     FROM reservations r
     INNER JOIN seats s ON r.seat_id = s.seat_id
     INNER JOIN showtimes st ON s.showtime_id = st.showtime_id
     WHERE r.reservation_id = ? AND r.user_id = ?`,
    [reservationId, userId]
  );

  if (rows.length === 0) {
    throw new Error('RESERVATION_NOT_FOUND');
  }

  if (new Date(rows[0].start_datetime) <= new Date()) {
    throw new Error('CANNOT_CANCEL_PAST');
  }

  await pool.query(
    'DELETE FROM reservations WHERE reservation_id = ?',
    [reservationId]
  );

  return true;
}

module.exports = {
  createReservation,
  getUserReservations,
  deleteReservation,
};