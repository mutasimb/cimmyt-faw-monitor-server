const
  express = require("express"),
  router = express.Router(),

  AggregatedData = require("../models/AggregatedData");


// @route    GET /api/aggregated-data
// @desc     Get aggregated data for season and area
// @access   Public
router.get("", async (req, res) => {
  const { season, area } = req.query;

  try {
    if(!season) throw new Error("'season' required");

    const aggData = await AggregatedData
      .find(
        !area ? { season }
          : area === 'country' ? { season, level: 0 }
            : { season, adm: area }
      )
      .sort("level adm timestep");

    res.json(aggData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
