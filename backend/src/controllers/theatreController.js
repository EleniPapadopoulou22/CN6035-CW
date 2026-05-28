const theatreService = require('../services/theatreService');

async function getTheatres(req, res) {
  try {
    const { search } = req.query;

    const theatres = search
      ? await theatreService.searchTheatres(search)
      : await theatreService.getAllTheatres();

    res.json({
      success: true,
      count: theatres.length,
      data: theatres,
    });
  } catch (error) {
    console.error('Get theatres error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load theatres',
    });
  }
}

async function getTheatreById(req, res) {
  try {
    const theatre = await theatreService.getTheatreById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    console.error('Get theatre by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load theatre',
    });
  }
}

module.exports = {
  getTheatres,
  getTheatreById,
};