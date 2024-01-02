const
  { Schema, model } = require("mongoose"),

  UserSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, default: "Data", enum: ["Super Admin", "Moderator", "User Manager", "Data"] },
    title: { type: String },
    org: { type: String },
    email: { type: String },
    phone: { type: String, unique: true },
    defaultSeason : { type: Schema.Types.ObjectId, ref: "seasons" },
    viewSeasons: [
      { type: Schema.Types.ObjectId, ref: "seasons" }
    ],
    editSeasons: [
      { type: Schema.Types.ObjectId, ref: "seasons" }
    ],
    password: { type: String, required: true },
    test: { type: Boolean }
  });

module.exports = model("users", UserSchema);
