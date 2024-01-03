const
  { Schema, model } = require("mongoose"),

  SeasonSchema = new Schema(
    {
      code: { type: String, required: true },
      name: { type: String, required: true },
      country: { type: Schema.Types.ObjectId, ref: "countries", required: true },
      crops: [
        { type: String, required: true }
      ],
      nTrap: { type: Number, required: true },
      season: { type: String, required: true },
      iY: { type: Number, required: true },
      im: { type: Number, required: true },
      id: { type: Number, required: true },
      listed: { type: Boolean, default: false },
      default: { type: Boolean, default: false },
      closed: { type: Boolean, default: true },
      extents: {
        u_count_012: { type: Number },
        u_count_3: { type: Number },
        u_count_sd: { type: Number },
        u_count_se: { type: Number },
        u_count_ci95: { type: Number },
        l_count_sd: { type: Number },
        l_count_se: { type: Number },
        l_count_ci95: { type: Number },
        u_infestation_012: { type: Number },
        u_infestation_3: { type: Number },
        u_infestation_sd: { type: Number },
        u_infestation_se: { type: Number },
        u_infestation_ci95: { type: Number },
        l_infestation_sd: { type: Number },
        l_infestation_se: { type: Number },
        l_infestation_ci95: { type: Number }
      },
      params: [{
        keyParam: { type: String, required: true, enum: ["count", "sfw", "iw", "cob"] },
        keyUnit: { type: String, required: true },
        nameParam: { type: String, required: true },
        abbParam: { type: String, required: true },
        unit: { type: String, required: true }
      }]
    }
  );

module.exports = model("seasons", SeasonSchema);
