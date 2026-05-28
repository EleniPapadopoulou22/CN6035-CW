const express = require('express');
const showController = require('../controllers/showController');

const router = express.Router();

router.get('/', showController.getShows);
router.get('/:id', showController.getShowById);

module.exports = router;