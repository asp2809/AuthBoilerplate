const express = require("express");
const mongoose = require("mongoose");

const app = express();

const bodyParser = require("body-parser");

// DB Config
const db = require("./config/keys").mongoURI;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err));

// Use Routes

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on Port ${port}`));
