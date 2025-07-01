require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Finance Tracker API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
