const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const AuthRoute = require("./Routes/AuthRoute");
const UserRoute = require("./Routes/UserRoute");
const PostRoute = require("./Routes/PostRoute");
const UploadRoute = require("./Routes/UploadRoute");

// Routes

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();
mongoose
  .connect(process.env.MONGO_DB, { dbName: "SocialMedia" })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// usage of routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);
