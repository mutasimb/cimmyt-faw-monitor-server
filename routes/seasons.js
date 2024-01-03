const
  express = require("express"),
  router = express.Router(),

  Seasons = require("../models/Seasons.js"),
  Users = require("../models/Users.js"),
  Countries = require("../models/Countries.js"),
  
  authMiddleware = require("../middleware/auth.js");


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

// @route    POST /api/seasons/new
// @desc     Create new season
// @access   Private
router.post("/new", authMiddleware, async (req, res) => {
  const
    { userId, body } = req,
    {
      code,
      name,
      nTrap,
      season,
      iY,
      im,
      id
    } = body,
    
    roles = ["Super Admin", "Moderator", "User Manager"];

  try {
    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to season data');

    const
      country = await Countries.findOne({ name: 'Bangladesh' }),

      newSeason = new Seasons({
        code,
        name,
        country,
        crops: ["Maize"],
        nTrap,
        season,
        iY,
        im,
        id,
        listed: true,
        default: false,
        closed: false,
        extents: {},
        params: [
          { keyParam: "count", keyUnit: "pdpt", nameParam: "Moth Count", abbParam: "Moth Count", unit: "/ day / trap" },
          { keyParam: "sfw", keyUnit: "percent", nameParam: "Small Fresh Windowpane Infestation", abbParam: "SFW Infestation", unit: "%" },
          { keyParam: "iw", keyUnit: "percent", nameParam: "Infested Whorl", abbParam: "IW Infestation", unit: "%" },
          { keyParam: "cob", keyUnit: "percent", nameParam: "Cob Infestation", abbParam: "Cob Infestation", unit: "%" }
        ]
      }),
      
      savedSeason = await newSeason.save();

    res.json({ savedSeason });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route    POST /api/seasons/edit
// @desc     Edit a season
// @access   Private
router.post("/edit", authMiddleware, async (req, res) => {
  const
    { userId, body } = req,
    {
      _id,
      code,
      name,
      nTrap,
      season,
      iY,
      im,
      id
    } = body,
    
    roles = ["Super Admin", "Moderator", "User Manager"];

  try {
    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to season data');

    const targetSeason = await Seasons.findById(_id);

    targetSeason.code = code;
    targetSeason.name = name;
    targetSeason.nTrap = nTrap;
    targetSeason.season = season;
    targetSeason.iY = iY;
    targetSeason.im = im;
    targetSeason.id = id;
    
    const savedSeason = await targetSeason.save();

    res.json({ savedSeason });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
