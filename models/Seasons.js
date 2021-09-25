const { Schema, model } = require("mongoose");

const SeasonSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, ref: "countries", required: true },
    crops: [
      { type: String, required: true }
    ],
    nTrap: { type: Number, required: true },
    season: { type: String, required: true },
    year_span: { type: String, required: true },
    iY: { type: Number, required: true },
    im: { type: Number, required: true },
    id: { type: Number, required: true },
    listed: { type: Boolean, default: false },
    default: { type: Boolean, default: false },
    closed: { type: Boolean, default: true }
  }
);

module.exports = model("seasons", SeasonSchema);
