const express = require('express');
const theatreController = require('../controllers/theatreController');

const router = express.Router();

router.get('/', theatreController.getTheatres);
router.get('/:id', theatreController.getTheatreById);

module.exports = router;