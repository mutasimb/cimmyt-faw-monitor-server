const
  express = require("express"),
  router = express.Router(),

  Areas = require("../models/Areas");


// @route    GET /api/areas
// @desc     Get all the areas for a specfic season
// @access   Public
router.get("", async (req, res) => {
  const { season } = req.query;

  try {
    const areas = await Areas.find({ season });
    res.json(areas);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
