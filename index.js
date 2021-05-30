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

app.post('/auth/user', (req, res) => {
  hasher({
    password: req.body.password,
  },
  async (err, pass, salt, hash) => {
    const username = req.body.username.toLowerCase();
    let users = await Users.find({
      username: username
    });
    if(users.length) {
      res.status(400).json({
        result: "failed",
        detail: {
          error: "Exist username",
          description: "이미 존재하는 이름입니다."
        }
      });
      return;
    }
    const newUser = new User({
      username: username,
      salt: salt,
      hash: hash,
      updated: false,
    });
    newUser.save()
      .then(() => {
        res.status(200).json({
          result: "success"
        });
      })
      .catch(err => {
        res.status(400).json({
          result: "failed",
          detail: err
        });
        return;
      });
  });
});

app.get('/', (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});