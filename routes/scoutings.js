const
  express = require("express"),
  router = express.Router(),

  authMiddleware = require("../middleware/auth"),

  Users = require("../models/Users"),
  Seasons = require("../models/Seasons"),
  Countries = require("../models/Countries"),
  Areas = require("../models/Areas"),
  Traps = require("../models/Traps"),
  Scoutings = require("../models/Scoutings");


// @route    POST /api/scouting-data
// @desc     Submission of scouting form
// @access   Private
router.post("", authMiddleware, async (req, res) => {
  const
    { userId } = req,
    {
      trap: trapId,
      longitude,
      latitude,
      moth,
      stage,
      sfw,
      iw,
      cob
    } = req.body,
    submissionTime = new Date().toISOString();

  try {

    const
      user = await Users.findById(userId).select("-password"),
      trap = await Traps.findById(trapId),
      area = trap ? await Areas.findById(trap.area) : null,
      season = trap ? await Seasons.findById(trap.season) : null,
      country = trap ? await Countries.findById(trap.country) : null;

    if(!user) throw new Error("User doesn't exist");
    if(!trap) throw new Error("Invalid trap selection");
    if(!area) throw new Error("Trap area doesn't exist in FAW Monitor database");
    if(!season) throw new Error("Trap season doesn't exist in FAW Monitor database");
    if(!country) throw new Error("Trap country doesn't exist in FAW Monitor database");

    if(user.editSeasons.indexOf(trap.season) === -1)
      throw new Error("User doesn't have permission to register traps for the selected season");
    if(season.closed) throw new Error("Seleced season has been over, new data cannot be submitted");

    let objData = {
      user: userId,
      season: trap.season,
      country: trap.country,
    };
    objData = country.admNames.length > 3
      ? { ...objData, adm1: area.parentId[0], adm2: area.parentId[1], adm3: area.parentId[2], adm4: area._id.toString() }
      : { ...objData, adm1: area.parentId[0], adm2: area.parentId[1], adm3: area._id.toString() };
    objData = {
      ...objData,
      trap: trapId,
      crop: trap.crop,
      tag: trap.tag,
      longitude: longitude ? longitude : null,
      latitude: latitude ? latitude : null,
      moth,
      stage,
      sfw,
      iw,
      cob,
      submissionTime,
      test: trap.test
    };
    
    const
      newData = new Scoutings(objData),
      savedData = await newData.save();

    res.send(savedData);
    
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route    GET /api/scouting-data
// @desc     Get all scouting form submissions by requesting user
// @access   Private
router.get("", authMiddleware, async (req, res) => {
  const { userId } = req;
  try {
    const scoutings = await Scoutings.find({ user: userId }).populate("adm1 adm2 adm3 adm4");
    res.json(scoutings);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
