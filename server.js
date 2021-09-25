const
  express = require("express"),
  { urlencoded, json } = require("body-parser"),
  mongoose = require("mongoose"),
  { mongoUri } = require("./config/keys"),

  app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  next();
});
app.use(urlencoded({ extended: false }));
app.use(json());


// routes
app.use("/api/users", require("./routes/users"));
app.use("/api/seasons", require("./routes/seasons"));
app.use("/api/countries", require("./routes/countries"));
app.use("/api/areas", require("./routes/areas"));
app.use("/api/aggregated-data", require("./routes/aggregated-data"));
app.use("/api/traps", require("./routes/traps"));
app.use("/api/scouting-data", require("./routes/scoutings"));


const
  connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  port = process.env.PORT || 9001;


// connect database and start listening
mongoose
  .connect(mongoUri, connectOptions)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(port);
    console.log(`Server running on port ${port}`);
  })
  .catch(err => {
    console.log('Failed to connect MongoDB', err);
  });
