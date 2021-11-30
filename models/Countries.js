const
  { Schema, model } = require("mongoose"),

  CountrySchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    tz: { type: Number, required: true },
    phCode: { type: Number, required: true },
    admNames: [
      { type: String }
    ]
  });

module.exports = model("countries", CountrySchema);
