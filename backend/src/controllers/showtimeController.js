const showtimeService = require('../services/showtimeService');

async function getShowtimes(req, res) {
  try {
    const showtimes = await showtimeService.getShowtimes({
      showId: req.query.showId,
      date: req.query.date,
    });

    res.json({
      success: true,
      count: showtimes.length,
      data: showtimes,
    });
  } catch (error) {
    console.error('Get showtimes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load showtimes',
    });
  }
}

async function getShowtimeById(req, res) {
  try {
    const showtime = await showtimeService.getShowtimeById(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    res.json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    console.error('Get showtime by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load showtime',
    });
  }
}

module.exports = {
  getShowtimes,
  getShowtimeById,
};