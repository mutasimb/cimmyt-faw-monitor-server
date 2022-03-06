const
  { Schema, model } = require("mongoose"),

  RawUserSchema = new Schema({
    season: { type: Schema.Types.ObjectId, ref: "seasons" },
    name: { type: String, required: true },
    title: { type: String },
    org: { type: String },
    adm1: { type: String, required: true },
    adm2: { type: String, required: true },
    adm3: { type: String, required: true },
    adm4: { type: String },
    block: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    test: { type: Boolean, default: false }
  });

module.exports = model("raw_users", RawUserSchema);
