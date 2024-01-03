const
  express = require("express"),
  router = express.Router(),

  Users = require("../models/Users.js"),
  Seasons = require("../models/Seasons.js"),

  authMiddleware = require("../middleware/auth.js"),
  
  generatePassword = require("../utils/generatePassword.js");


// @route    GET /api/admins
// @desc     Get list of admins
// @access   Private
router.get("", authMiddleware, async (req, res) => {
  const
    { userId } = req,
    roles = ["Super Admin", "Moderator", "User Manager"];
  
  try {
    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to admin data');

    const admins = await Users.find({ role: { $in: roles } }).select("-password");

    res.json(admins);
  } catch (err) {
    res.status(500).send(error);
  }
});

// @route    POST /api/admins/new
// @desc     Create new admin
// @access   Private
router.post("/new", authMiddleware, async (req, res) => {
  const
    { userId, body } = req,
    {
      name,
      role,
      title,
      org,
      phone
    } = body,
    
    roles = ["Super Admin", "Moderator"],
    phoneRegex = /^8801[0-9]{9}$/;
  
  try {
    if (!phoneRegex.test(phone)) throw new Error('Invalid phone number');

    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to create new admin');

    const
      { password, hashedPassword } = await generatePassword(phone),
      defaultSeason = await Seasons.findOne({ default: true }),

      newUser = new Users({
        name,
        role,
        title,
        org,
        phone,
        defaultSeason,
        viewSeasons: [],
        editSeasons: [],
        password: hashedPassword
      }),

      savedUser = await newUser.save();

    res.json({ savedUser, password });
  } catch (err) {
    res.status(500).send(err);
  }
});

// @route    POST /api/admins/edit
// @desc     Edit an admin user
// @access   Private
router.post("/edit", authMiddleware, async (req, res) => {
  const
    { userId, body } = req,
    {
      id,
      name,
      role,
      title,
      org,
      phone
    } = body,
    
    roles = ["Super Admin", "Moderator"],
    phoneRegex = /^8801[0-9]{9}$/;
  
  try {
    if (!phoneRegex.test(phone)) throw new Error('Invalid phone number');

    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to create new admin');

    const targetUser = await Users.findById(id);

    targetUser.name = name;
    targetUser.role = role;
    targetUser.title = title;
    targetUser.org = org;
    targetUser.phone = phone;

    const savedUser = await targetUser.save();

    res.json({ savedUser });
  } catch (err) {
    res.status(500).send(err);
  }
});

// @route    POST /api/admins
// @desc     Delete an admin user
// @access   Private
router.delete("", authMiddleware, async (req, res) => {
  const
    { userId, body } = req,
    { id } = body,
    
    roles = ["Super Admin", "Moderator"];

  try {
    if(userId === id) throw new Error('User cannot delete itself');

    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to delete admin user');

    await Users.findByIdAndDelete(id);

    res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @route    PATCH /api/admins/password
// @desc     Update password of a user
// @access   Private
router.patch("/password", authMiddleware, async (req, res) => {
  const
    { userId, body } = req,
    { id } = body,
    
    roles = ["Super Admin", "Moderator"];

  try {
    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to modify admin user');

    const
      targetUser = await Users.findById(id),
      { password, hashedPassword } = await generatePassword(targetUser.phone);
    targetUser.password = hashedPassword;

    await targetUser.save();

    res.json({ password });
  } catch (err) {
    res.status(500).send(err);
  }
});

// @route    GET /api/admins/users
// @desc     Get list of users for a season
// @access   Private
router.get("/users", authMiddleware, async (req, res) => {
  const
    { userId, query } = req,
    { season } = query,

    roles = ["Super Admin", "Moderator", "User Manager"];

  try {
    const user = await Users.findById(userId).select("-password");
    if(roles.indexOf(user.role) === -1) throw new Error('No access to admin data');

    const targetUsers = await Users.find({ editSeasons: season, test: { $ne: true } }).select("-password");

    res.json({ targetUsers });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
