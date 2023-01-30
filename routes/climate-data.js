const
  express = require("express"),
  { get } = require("axios"),
  router = express.Router(),
  
  { serverForecast } = require("../config/keys.js"),

  Areas = require("../models/Areas.js"),
  Traps = require("../models/Traps.js"),

  authMiddleware = require("../middleware/auth.js");


// @route    GET /api/climate-data/upazila
// @desc     Get the climate data against a date and an area's gid
// @access   Private
router.get("/upazila", authMiddleware, async (req, res) => {
  const 
    { userId } = req,
    { date, season } = req.query;

  try {
    const
      traps = await Traps
        .find({ season, user: userId })
        .populate("area"),
      gids = traps
        .map(trap => trap._doc.area.gid.split("_").slice(0, -1).join("_"))
        .filter((gid, i, arr) => arr.indexOf(gid) === i),

      gidUpzs = await Areas.find({ season, gid: { $in: gids } }),
      gidForecasts = await get(
        '/api/faw-forecasts/upazila',
        {
          baseURL: serverForecast,
          params: { date, gids: gids.join(',') }
        }
      );

    res.json(gidForecasts.data.map((el, i) => ({ ...el, area: gidUpzs[i]._doc })));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
