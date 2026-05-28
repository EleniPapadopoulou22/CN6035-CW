const express = require('express');
const showtimeController = require('../controllers/showtimeController');

const router = express.Router();

router.get('/', showtimeController.getShowtimes);
router.get('/:id', showtimeController.getShowtimeById);

module.exports = router;