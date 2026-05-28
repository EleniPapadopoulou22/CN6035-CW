const seatService = require('../services/seatService');

async function getSeats(req, res) {
  try {
    const { showtimeId } = req.query;

    if (!showtimeId) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId is required',
      });
    }

    const seats = await seatService.getSeatsByShowtime(showtimeId);

    res.json({
      success: true,
      count: seats.length,
      data: seats,
    });
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load seats',
    });
  }
}

module.exports = {
  getSeats,
};