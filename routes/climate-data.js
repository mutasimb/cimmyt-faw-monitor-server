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
    const traps = await Traps
      .find({ season, user: userId })
      .populate("area");
    if (traps.length === 0) throw new Error("No traps");

    const
      gids = traps
        .map(trap => trap._doc.area.gid.split("_").slice(0, -1).join("_"))
        .filter((gid, i, arr) => arr.indexOf(gid) === i),

      areaUpzs = await Areas.find({ season, gid: { $in: gids } }),
      gidForecasts = await get(
        '/api/faw-forecasts/upazila',
        {
          baseURL: serverForecast,
          params: { date, gids: gids.join(',') }
        }
      );

    res.json(
      areaUpzs.map(areaUpz => ({
        ...areaUpz._doc,
        forecast: gidForecasts.data.find(forecast => forecast.gid === areaUpz._doc.gid) || null
      }))
    );
  } catch (err) {
    res.status(500).send('response' in err ? err.response.data : err.message);
  }
});

module.exports = router;
