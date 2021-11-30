const
  { Schema, model } = require("mongoose"),

  ScoutingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    season: { type: Schema.Types.ObjectId, ref: "seasons", required: true },
    country: { type: Schema.Types.ObjectId, ref: "countries", required: true },
    adm1: { type: Schema.Types.ObjectId, ref: "areas", required: true },
    adm2: { type: Schema.Types.ObjectId, ref: "areas", required: true },
    adm3: { type: Schema.Types.ObjectId, ref: "areas", required: true },
    adm4: { type: Schema.Types.ObjectId, ref: "areas" },
    trap: { type: Schema.Types.ObjectId, ref: "areas", required: true },
    crop: { type: String, required: true },
    tag: { type: String, required: true },
    longitude: { type: Number },
    latitude: { type: Number },
    moth: { type: Number, required: true },
    stage: { type: String, required: true },
    sfw: { type: Number, required: true },
    iw: { type: Number, required: true },
    cob: { type: Number, default: 0 },
    submissionTime: { type: Date, required: true },
    verified: { type: Boolean },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "users" },
    test: { type: Boolean }
  });
  
module.exports = model("scoutings", ScoutingSchema);
