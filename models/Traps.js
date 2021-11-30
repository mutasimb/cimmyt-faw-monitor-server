const
  { Schema, model } = require("mongoose"),

  TrapSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    season: { type: Schema.Types.ObjectId, ref: "seasons", required: true },
    country: { type: Schema.Types.ObjectId, ref: "countries", required: true },
    area: { type: Schema.Types.ObjectId, ref: "areas", required: true }, 
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    crop: { type: String, required: true },
    tag: { type: String, required: true },
    installationDate: { type: Date, required: true },
    farmer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      phoneUser: { type: String, required: true },
      address: { type: String, required: true },
      landOwner: { type: Boolean, required: true }
    },
    landOwner: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    },
    submissionTime: { type: Date, required: true },
    verified: { type: Boolean },
    test: { type: Boolean }
  });
  
module.exports = model("traps", TrapSchema);
