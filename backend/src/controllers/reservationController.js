const reservationService = require('../services/reservationService');

async function createReservation(req, res) {
  try {
    const { seatId } = req.body;
    const userId = req.user.user_id;

    if (!seatId) {
      return res.status(400).json({
        success: false,
        message: 'Το seatId είναι υποχρεωτικό',
      });
    }

    const reservation = await reservationService.createReservation(userId, seatId);

    res.status(201).json({
      success: true,
      message: 'Η κράτηση δημιουργήθηκε επιτυχώς',
      data: reservation,
    });
  } catch (error) {
    if (error.message === 'SEAT_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Η θέση δεν βρέθηκε',
      });
    }

    if (error.message === 'SEAT_ALREADY_RESERVED') {
      return res.status(409).json({
        success: false,
        message: 'Η θέση δεν είναι διαθέσιμη',
      });
    }

    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Αποτυχία δημιουργίας κράτησης',
    });
  }
}

async function getMyReservations(req, res) {
  try {
    const reservations = await reservationService.getUserReservations(req.user.user_id);

    res.json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Αποτυχία φόρτωσης των κρατήσεων',
    });
  }
}

async function deleteReservation(req, res) {
  try {
    await reservationService.deleteReservation(req.params.id, req.user.user_id);

    res.json({
      success: true,
      message: 'Η κράτηση ακυρώθηκε επιτυχώς',
    });
  } catch (error) {
    if (error.message === 'RESERVATION_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Δεβρέθηκε η κράτηση',
      });
    }

    if (error.message === 'CANNOT_CANCEL_PAST') {
      return res.status(400).json({
        success: false,
        message: 'Προηγούμενες κρατήσεις δεν μπορούν να ακυρωθούν',
      });
    }

    console.error('Delete reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Αποτυχία ακύρωσης της κράτησης',
    });
  }
}

module.exports = {
  createReservation,
  getMyReservations,
  deleteReservation,
};