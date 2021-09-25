const
  express = require("express"),
  router = express.Router(),

  Seasons = require("../models/Seasons");


// @route    GET /api/seasons
// @desc     Get all the FAW data collection seasons from the database
// @access   Public
router.get("", async (req, res) => {
  try {
    const seasons = await Seasons.find({ listed: true }).select("-listed").sort('iY im id');
    res.json(seasons);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
