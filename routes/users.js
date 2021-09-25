const
  { JWT_SECRET } = process.env,

  express = require("express"),
  { compare } = require("bcryptjs"),
  { sign } = require("jsonwebtoken"),

  router = express.Router(),

  Users = require("../models/Users"),

  authMiddleware = require("../middleware/auth"),
  isValidEmail = require("../utils/isValidEmail");


// @route    GET /api/users
// @desc     Get user object by ID
// @access   Public
router.get("", authMiddleware, async (req, res) => {
  const { userId } = req;
  
  try {
    const user = await Users
      .findById(userId)
      .select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).send(error);
  }
});

// @route    POST /api/users/exists
// @desc     Check whether a user exists by ID (email or phone)
// @access   Public
router.post("/exists", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await Users
      .findOne(isValidEmail(id) ? { email: id } : { phone: id })
      .select("-password");
    
    if (!user) throw new Error("ID is not registered");

    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route    POST /api/users/auth
// @desc     Sign user in via ID and password
// @access   Public
router.post("/auth", async (req, res) => {
  const { id, password } = req.body;

  try {
    const
      user = await Users.findById(id),
      isMatch = await compare(password, user.password);

    if (!isMatch) throw new Error('Wrong password');

    const payload = {
      user: { id: user.id }
    };

    sign(payload, JWT_SECRET, { expiresIn: '14 days' }, (err, token) => {
      if (err) throw new Error(err.message);
      res.send(token);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
