const pool = require('../config/db');

// Επιστρέφει όλα τα θεάτρα για την αρχική οθόνη.
async function getAllTheatres() {
  const [rows] = await pool.query(
    'SELECT theatre_id, name, location, description FROM theatres ORDER BY name'
  );

  return rows;
}

// Επιστρέφει τα στοιχεία ενός θεάτρου με βάση το theatre_id. 
// Επιστρέφει null αν δεν βρεθεί.
async function getTheatreById(theatreId) {
  const [rows] = await pool.query(
    'SELECT theatre_id, name, location, description FROM theatres WHERE theatre_id = ?',
    [theatreId]
  );

  return rows[0] || null;
}

// Ψαχνει θεάτρα με βάση ένα όρο αναζήτησης 
// που μπορεί να ταιριάζει στο όνομα ή την τοποθεσία.
async function searchTheatres(searchTerm) {
  const [rows] = await pool.query(
    `SELECT theatre_id, name, location, description
     FROM theatres
     WHERE name LIKE ? OR location LIKE ?
     ORDER BY name`,
    [`%${searchTerm}%`, `%${searchTerm}%`]
  );

  return rows;
}

module.exports = {
  getAllTheatres,
  getTheatreById,
  searchTheatres,
};