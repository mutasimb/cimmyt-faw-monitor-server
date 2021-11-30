const
  { Schema, model } = require("mongoose"),

  AggregatedDataSchema = new Schema({
    season: { type: Schema.Types.ObjectId, ref: "seasons", required: true },
    country: { type: Schema.Types.ObjectId, ref: "countries", required: true },
    level: { type: Number, required: true },
    timestep: { type: Date, required: true }, 
    traps: { type: Number, required: true },
    count_pdpt: { type: Number, required: true },
    count_sd: { type: Number },
    count_se: { type: Number },
    count_ci95: { type: Number },
    sfw_percent: { type: Number, required: true },
    sfw_sd: { type: Number },
    sfw_se: { type: Number },
    sfw_ci95: { type: Number },
    iw_percent: { type: Number, required: true },
    iw_sd: { type: Number },
    iw_se: { type: Number },
    iw_ci95: { type: Number },
    cob_percent: { type: Number, required: true },
    cob_sd: { type: Number },
    cob_se: { type: Number },
    cob_ci95: { type: Number },
    adm: { type: Schema.Types.ObjectId, ref: "areas" }
  });
  
module.exports = model("agg_data", AggregatedDataSchema, "agg_data");
