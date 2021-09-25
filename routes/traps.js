const
  express = require("express"),
  router = express.Router(),

  authMiddleware = require("../middleware/auth"),

  Users = require("../models/Users"),
  Countries = require("../models/Countries"),
  Seasons = require("../models/Seasons"),
  Areas = require("../models/Areas"),
  Traps = require("../models/Traps");


// @route    POST /api/traps
// @desc     Register a new trap
// @access   Private
router.post("", authMiddleware, async (req, res) => {
  const
    { userId } = req,
    {
      season: seasonId,
      country: countryId,
      longitude,
      latitude,
      area,
      crop,
      tag,
      installationDate,
      farmer,
      landOwner
    } = req.body,
    submissionTime = new Date().toISOString();

  try {

    const user = await Users.findById(userId).select("-password");
    if(!user) throw new Error("User doesn't exist");

    if(user.editSeasons.indexOf(seasonId) === -1)
      throw new Error("User doesn't have permission to register traps for the selected season");

    const season = await Seasons.findById(seasonId);
    if(!season) throw new Error("Selected season doesn't exist");
    if(season.country.toString() !== countryId) throw new Error("Unexpected error with season and country");

    const country = await Countries.findById(countryId);
    if(!country) throw new Error("Country doesn't exist");
    if(country.admNames.length * 2 !== Object.keys(area).length) throw new Error("Error in area selection");

    if(!longitude || !latitude) throw new Error("Geolocation could not be detected");

    const newAdms = [];

    let adm_1 = await Areas.findOne({ season: seasonId, level: 1, gid: area.GID_1 });
    if(!adm_1) {
      adm_1 = new Areas({
        season: seasonId,
        country: countryId,
        level: 1,
        gid: area.GID_1,
        name: area.NAME_1,
        parentId: [],
        parentNames: []
      });
      await adm_1.save();
      newAdms.push(adm_1._id);
    }

    let adm_2 = await Areas.findOne({ season: seasonId, level: 2, gid: area.GID_2 });
    if(!adm_2) {
      adm_2 = new Areas({
        season: seasonId,
        country: countryId,
        level: 2,
        gid: area.GID_2,
        name: area.NAME_2,
        parentId: [adm_1._id],
        parentNames: [adm_1.name]
      });
      await adm_2.save();
      newAdms.push(adm_2._id);
    }

    let adm_3 = await Areas.findOne({ season: seasonId, level: 3, gid: area.GID_3 });
    if(!adm_3) {
      adm_3 = new Areas({
        season: seasonId,
        country: countryId,
        level: 3,
        gid: area.GID_3,
        name: area.NAME_3,
        parentId: [adm_1._id, adm_2._id],
        parentNames: [adm_1.name, adm_2.name]
      });
      await adm_3.save();
      newAdms.push(adm_3._id);
    }

    let adm_4;
    if(country.admNames.length > 3) {
      adm_4 = await Areas.findOne({ season: seasonId, level: 4, gid: area.GID_4 });
      if(!adm_4) {
        adm_4 = new Areas({
          season: seasonId,
          country: countryId,
          level: 4,
          gid: area.GID_4,
          name: area.NAME_4,
          parentId: [adm_1._id, adm_2._id, adm_3._id],
          parentNames: [adm_1.name, adm_2.name, adm_3.name]
        });
        await adm_4.save();
        newAdms.push(adm_4._id);
      }
    }

    const
      trapAreaId = country.admNames.length > 3 ? adm_4._id : adm_3._id,
      trapsExisting = await Traps.find({ user: userId, season: seasonId, area: trapAreaId, crop });
    if(trapsExisting.length === season.nTrap)
      throw new Error(`You cannot register more traps in this area for the selected crop`);
    if(trapsExisting.map(el => el.tag).indexOf(tag) > -1)
      throw new Error(`You already registered a trap with tag '${tag}' in this area`);

    let trapObj = {
      user: userId,
      season: seasonId,
      country: countryId,
      area: trapAreaId,
      longitude,
      latitude,
      crop,
      tag,
      installationDate,
      farmer,
      landOwner,
      submissionTime
    };
    if(user.test) trapObj = { ...trapObj, test: true };

    const newTrap = new Traps(trapObj);
    await newTrap.save();

    const newTrapPopulated = await Traps.populate(newTrap, 'area')
    res.send(newTrapPopulated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route    GET /api/traps
// @desc     Get traps by season and user
// @access   Private
router.get("", authMiddleware, async (req, res) => {
  const
    { userId } = req,
    { season } = req.params;

  try {
    if(season) {

    } else {
      const traps = await Traps.find({ user: userId }).populate("area");
      res.json(traps);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
  
module.exports = router;
