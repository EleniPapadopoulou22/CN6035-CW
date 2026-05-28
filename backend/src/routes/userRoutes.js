const express = require('express');
const reservationController = require('../controllers/reservationController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/reservations', authenticateToken, reservationController.getMyReservations);

module.exports = router;