//config
const config = require('./config/config.json');

//libraries
const hasher = require("pbkdf2-password")();
const express = require('express');
const mongoose = require('mongoose');

//schemas
const User = require('./schemas/user');
const Store = require('./schemas/store');

//express environment
const port = process.env.PORT || 80;
const app = express();

//express settings
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send("hi");
});


app.get('/', (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});