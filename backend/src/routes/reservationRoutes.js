const express = require('express');
const reservationController = require('../controllers/reservationController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/', reservationController.createReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;