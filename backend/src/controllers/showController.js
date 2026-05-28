const showService = require('../services/showService');

async function getShows(req, res) {
  try {
    const shows = await showService.getShows({
      theatreId: req.query.theatreId,
      title: req.query.title,
    });

    res.json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    console.error('Get shows error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load shows',
    });
  }
}

async function getShowById(req, res) {
  try {
    const show = await showService.getShowById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      data: show,
    });
  } catch (error) {
    console.error('Get show by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load show',
    });
  }
}

module.exports = {
  getShows,
  getShowById,
};