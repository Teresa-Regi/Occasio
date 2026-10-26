const registrationRoutes = require("./routes/registrations");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/api/test", (req, res) => {
  res.json({ message: "Correct server.js is running!" });
});
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrations"));

app.get("/", (req, res) => {
  res.send("Occasio Event Management API is running!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Occasio server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });