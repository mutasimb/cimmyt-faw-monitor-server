const
  express = require("express"),
  router = express.Router(),

  Countries = require("../models/Countries");


// @route    GET /api/countries
// @desc     Get all the countries from the database
// @access   Public
router.get("", async (req, res) => {
  try {
    const countries = await Countries.find();
    res.json(countries);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
  
module.exports = router;
