const
  express = require("express"),
  { urlencoded, json } = require("body-parser"),
  { connect } = require("mongoose"),

  { mongoUri } = require("./config/keys.js"),

  app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  next();
});
app.use(urlencoded({ extended: false }));
app.use(json());

// routes
app.use("/api/users", require("./routes/users.js"));
app.use("/api/admins", require("./routes/admins.js"));
app.use("/api/seasons", require("./routes/seasons.js"));
app.use("/api/countries", require("./routes/countries.js"));
app.use("/api/areas", require("./routes/areas.js"));
app.use("/api/aggregated-data", require("./routes/aggregated-data.js"));
app.use("/api/traps", require("./routes/traps.js"));
app.use("/api/scouting-data", require("./routes/scoutings.js"));
app.use("/api/climate-data", require("./routes/climate-data.js"));


const
  connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  port = process.env.PORT || 9001,
  serverInitiate = async () => {
    try {
      await connect(mongoUri, connectOptions);
      console.log('Successfully connected to MongoDB');

      await app.listen(port);
      console.log(`Server running on port ${port}`);
    } catch (error) {
      console.log('Failed to connect MongoDB', error);
    }
  };

serverInitiate();
